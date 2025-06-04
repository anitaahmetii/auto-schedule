using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;
        private readonly RoleManager<Role> roleManager;
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;
        private readonly IConfiguration _configuration;

        public UserService(UserManager<User> userManager,RoleManager<Role> roleManager,AppDbContext appDbContext ,IMapper mapper,IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.appDbContext = appDbContext;
            this.mapper = mapper;
            _configuration = configuration;
        }
        public async Task<AuthenticationModel> LoginAsync(LoginModel loginModel, CancellationToken cancellationToken)
        {
            var user = await appDbContext.Users.Where(x => x.Email == loginModel.Email).FirstOrDefaultAsync(cancellationToken);

            if (user is null)
            {
                throw new Exception();
            }

            if (!await userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                throw new Exception("Incorrect Password");
            }
            var authClaims = new List<Claim>()
            {
                 new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                 new Claim(ClaimTypes.Name,user.UserName),
                 new Claim(ClaimTypes.Email,user.Email),
            };
            var userRoles = await userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTSettings:TokenKey"]));

            var token = new JwtSecurityToken(
                claims: authClaims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256));

            IdentityModelEventSource.ShowPII = true;

            var userData = mapper.Map<UserModel>(user);
            if (userRoles.Contains("Admin"))
                userData.Role = Domain.Enum.Role.Admin;
            else if (userRoles.Contains("Coordinator"))
                userData.Role = Domain.Enum.Role.Coordinator;
            else if (userRoles.Contains("Receptionist"))
                userData.Role = Domain.Enum.Role.Receptionist;
            else if (userRoles.Contains("Lecture"))
                userData.Role = Domain.Enum.Role.Lecture;
            else
                userData.Role = Domain.Enum.Role.Student;

            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddHours(16);
            await appDbContext.SaveChangesAsync(cancellationToken);

            var jwtTOken = new JwtSecurityTokenHandler().WriteToken(token);
            var response = new AuthenticationModel()
            {
                Token = jwtTOken,
                RefreshToken = refreshToken,
                ExpiresAt = token.ValidTo,
                UserData = userData!,
                UserRole = userRoles.FirstOrDefault()!

            };

            return response;
        }

        public async Task<AuthenticationModel> RefreshTokenAsync(RefreshTokenRequest model)
        {
            var user = await appDbContext.Users.FirstOrDefaultAsync(u => u.RefreshToken == model.RefreshToken);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token.");
            }

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var userRoles = await userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTSettings:TokenKey"]));

            var token = new JwtSecurityToken(
                claims: authClaims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            var newJwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            var newRefreshToken = GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddHours(2);

            await appDbContext.SaveChangesAsync();

            return new AuthenticationModel
            {
                Token = newJwtToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = token.ValidTo,
                UserData = mapper.Map<UserModel>(user),
                UserRole = userRoles.FirstOrDefault()!
            };
        }
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public async Task<UserModel> AddOrEditUserAsync(UserModel model, CancellationToken cancellationToken)
        {
            User user;

            // Create or update base user
            if (!model.Id.HasValue)
            {
                // Choose the correct derived type
                user = model.Role switch
                {
                    Domain.Enum.Role.Receptionist => new Receptionist(),
                    Domain.Enum.Role.Coordinator => new Coordinator(),
                    Domain.Enum.Role.Lecture => new Lectures(),
                    Domain.Enum.Role.Student => new Student(),
                    _ => new User()
                };

                user.UserName = model.UserName;
                user.LastName = model.LastName;
                user.Email = model.Email;

                // Set derived properties
                SetRoleSpecificFields(user, model);

                var result = await userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                {
                    var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                    throw new Exception($"User creation failed: {errors}");
                }
            }
            else
            {
                user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == model.Id, cancellationToken);
                if (user is null)
                    throw new Exception("User not found.");

                user.UserName = model.UserName;
                user.LastName = model.LastName;
                user.Email = model.Email;

                SetRoleSpecificFields(user, model);

                var roles = await userManager.GetRolesAsync(user);
                await userManager.RemoveFromRolesAsync(user, roles);

                if (!string.IsNullOrWhiteSpace(model.Password))
                {
                    await userManager.RemovePasswordAsync(user);
                    await userManager.AddPasswordAsync(user, model.Password);
                }

                appDbContext.Users.Update(user);
            }

            var role = model.Role?.ToString();

            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new Role { Name = role });

            await userManager.AddToRoleAsync(user, role);

            await appDbContext.SaveChangesAsync(cancellationToken);
            return model;
        }

        private void SetRoleSpecificFields(User user, UserModel model)
        {
            switch (user)
            {
                case Coordinator coordinator:
                    coordinator.Responsibilities = model.CoordinatorResponsibilities;
                    coordinator.Status = model.StaffStatus;
                    break;

                case Receptionist receptionist:
                    receptionist.Responsibilities = model.ReceptionistResponsibilities;
                    receptionist.Status = model.StaffStatus;
                    break;

                case Lectures lecture:
                    lecture.Status = model.StaffStatus;
                    lecture.AcademicGrade = model.AcademicGrade;
                    lecture.lectureType = model.LectureType!.Value;
                    lecture.ScheduleTypeId = model.ScheduleTypeId!.Value;
                    break;

                case Student student:
                    student.AcademicProgram = model.AcademicProgram;
                    student.GroupId = model.GroupId!.Value;
                    break;
            }
        }





        //public async Task<UserModel> CreateOrUpdate(UserModel model, CancellationToken cancellationToken)
        //{
        //    User user;

        //    if (model.Id == null)
        //    {
        //        // Krijoni një përdorues të ri
        //        user = new User
        //        {
        //            UserName = model.UserName,
        //            Email = model.Email,
        //            PhoneNumber = model.PhoneNumber
        //        };

        //        var result = await userManager.CreateAsync(user, model.Password);

        //        if (!result.Succeeded)
        //        {
        //            var errorMessages = string.Join(", ", result.Errors.Select(e => e.Description));
        //            throw new Exception($"Përpjekja për të krijuar përdoruesin ka dështuar: {errorMessages}");
        //        }
        //    }
        //    else
        //    {
        //        // Përditësoni përdoruesin ekzistues
        //        user = await userManager.FindByIdAsync(model.Id.ToString());

        //        if (user == null)
        //        {
        //            throw new Exception("Përdoruesi nuk u gjet për përditësim.");
        //        }

        //        user = mapper.Map(model, user);

        //        // Nëse ka ndryshuar password-i, mund të ri-dërgoni dhe të përditësoni
        //        if (!string.IsNullOrEmpty(model.Password))
        //        {
        //            var token = await userManager.GeneratePasswordResetTokenAsync(user);
        //            var result = await userManager.ResetPasswordAsync(user, token, model.Password);

        //            if (!result.Succeeded)
        //            {
        //                var errorMessages = string.Join(", ", result.Errors.Select(e => e.Description));
        //                throw new Exception($"Dështoi përditësimi i fjalëkalimit: {errorMessages}");
        //            }
        //        }
        //    }

        //    return mapper.Map<UserModel>(user);
        //}

        public async Task DeleteUser(Guid Id, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByIdAsync(Id.ToString());

            if (user != null)
            {
                var result = await userManager.DeleteAsync(user);

                if (!result.Succeeded)
                {
                    var errorMessages = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new Exception($"Dështoi për fshirjen e përdoruesit: {errorMessages}");
                }
            }
            else
            {
                throw new Exception("Përdoruesi nuk u gjet për fshirje.");
            }
        }

        //public async Task<List<UserModel>> GetAll(CancellationToken cancellationToken)
        //{
        //    var users = await userManager.Users.ToListAsync(cancellationToken);
        //    return mapper.Map<List<UserModel>>(users);
        //}
        public async Task<List<UserModel>> GetAllUsersAsync(CancellationToken cancellationToken)
        {
            // Load all users with derived types using TPH
            var users = await appDbContext.Users.ToListAsync(cancellationToken);
            var userModels = new List<UserModel>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                var model = mapper.Map<UserModel>(user);

                if (roles.Contains("Admin"))
                {
                    model.Role = Domain.Enum.Role.Admin;
                }
                else if (roles.Contains("Coordinator") && user is Coordinator coordinator)
                {
                    model.Role = Domain.Enum.Role.Coordinator;
                    model.CoordinatorResponsibilities = coordinator.Responsibilities;
                    model.StaffStatus = coordinator.Status;
                }
                else if (roles.Contains("Receptionist") && user is Receptionist receptionist)
                {
                    model.Role = Domain.Enum.Role.Receptionist;
                    model.ReceptionistResponsibilities = receptionist.Responsibilities;
                    model.StaffStatus = receptionist.Status;
                }
                else if (roles.Contains("Lecture") && user is Lectures lecture)
                {
                    model.Role = Domain.Enum.Role.Lecture;
                    model.StaffStatus = lecture.Status;
                    model.AcademicGrade = lecture.AcademicGrade;
                    model.LectureType = lecture.lectureType;
                    model.ScheduleTypeId = lecture.ScheduleTypeId;
                }
                else if (roles.Contains("Student") && user is Student student)
                {
                    model.Role = Domain.Enum.Role.Student;
                    model.AcademicProgram = student.AcademicProgram;
                    model.GroupId = student.GroupId;
                }

                userModels.Add(model);
            }

            return userModels;
        }


        //public async Task<UserModel> GetById(Guid Id, CancellationToken cancellationToken)
        //{
        //    var user = await userManager.FindByIdAsync(Id.ToString());

        //    if (user == null)
        //    {
        //        throw new Exception("Përdoruesi nuk u gjet.");
        //    }

        //    return mapper.Map<UserModel>(user);
        //}

        public async Task<UserModel> GetUserById(Guid userId, CancellationToken cancellationToken)
        {
            var user = await appDbContext.Users
                .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);

            if (user is null)
                throw new Exception("User not found");

            var roles = await userManager.GetRolesAsync(user);
            var model = mapper.Map<UserModel>(user);

            if (roles.Contains("Admin"))
            {
                model.Role = Domain.Enum.Role.Admin;
            }
            else if (roles.Contains("Coordinator") && user is Coordinator coordinator)
            {
                model.Role = Domain.Enum.Role.Coordinator;
                model.CoordinatorResponsibilities = coordinator.Responsibilities;
                model.StaffStatus = coordinator.Status;
            }
            else if (roles.Contains("Receptionist") && user is Receptionist receptionist)
            {
                model.Role = Domain.Enum.Role.Receptionist;
                model.ReceptionistResponsibilities = receptionist.Responsibilities;
                model.StaffStatus = receptionist.Status;
            }
            else if (roles.Contains("Lecture") && user is Lectures lecture)
            {
                model.Role = Domain.Enum.Role.Lecture;
                model.StaffStatus = lecture.Status;
                model.AcademicGrade = lecture.AcademicGrade;
                model.LectureType = lecture.lectureType;
                model.ScheduleTypeId = lecture.ScheduleTypeId;
            }
            else if (roles.Contains("Student") && user is Student student)
            {
                model.Role = Domain.Enum.Role.Student;
                model.AcademicProgram = student.AcademicProgram;
                model.GroupId = student.GroupId;
            }

            return model;
        }

        public async Task<List<UserModel>> GetAllAdminsAsync(CancellationToken cancellationToken)
        {
            // Get users in "Admin" role
            var adminUsers = await userManager.GetUsersInRoleAsync("Admin");

            var models = new List<UserModel>();

            foreach (var user in adminUsers)
            {
                // Map base user to UserModel
                var model = mapper.Map<UserModel>(user);
                model.Role = Domain.Enum.Role.Admin;

                models.Add(model);
            }

            return models;
        }

        public async Task<List<ListItemModel>> GetLecturesAsync(CancellationToken cancellationToken)
        {
            Guid lectureRoleId = new Guid("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX");

            var lectures = await appDbContext.Users
                .Include(u => u.UserRoles)
                .Where(u => u.UserRoles.Any(ur => ur.RoleId == lectureRoleId))
                .Select(u => new ListItemModel
                {
                    Id = u.Id,
                    Name = u.UserName
                })
                .ToListAsync(cancellationToken);

            return lectures;
        }

    }
}