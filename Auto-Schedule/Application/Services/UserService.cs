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
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;
        private readonly IConfiguration _configuration;

        public UserService(UserManager<User> userManager,AppDbContext appDbContext ,IMapper mapper,IConfiguration configuration)
        {
            this.userManager = userManager;
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
                 new Claim(ClaimTypes.Name,user.UserName),
                 new Claim(ClaimTypes.Email,user.Email),
            };
            var userRoles = await userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }
            var authSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JWTSettings:TokenKey"]));

            var token = new JwtSecurityToken(
                claims: authClaims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256));

            IdentityModelEventSource.ShowPII = true;

            var userData = mapper.Map<UserModel>(user);

            var jwtTOken = new JwtSecurityTokenHandler().WriteToken(token);
            var response = new AuthenticationModel()
            {
                Token = jwtTOken,
                RefreshToken = null!,
                ExpiresAt = token.ValidTo,
                UserData = userData!,
                UserRole = userRoles.FirstOrDefault()!

            };

            return response;
        }

        public async Task<UserModel> AddOrEditUserAsync(UserModel model, CancellationToken cancellationToken)
        {
            var user = new User();
            // Guid? userId = authorizationManager.GetUserId();

            if (!model.Id.HasValue)
            {
                user = new User
                {
                    UserName = model.UserName,
                    LastName = model.LastName,
                    Email = model.Email,
                };

                var result = await userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    throw new Exception();
                }

            }
            else
            {
                user = await appDbContext.Users
               .Include(x => x.UserRoles)
               .Where(x => x.Id == model.Id.Value)
               .FirstOrDefaultAsync(cancellationToken);

                if (user is null)
                {
                    throw new Exception();
                }

                var roles = await userManager.GetRolesAsync(user);
                await userManager.RemoveFromRolesAsync(user, roles);

                if (model.Password != null)
                {
                    await userManager.RemovePasswordAsync(user);

                    await userManager.AddPasswordAsync(user, model.Password);
                }

            }

            user.Email = model.Email;
            user.LastName = model.LastName;
            user.UserName = model.UserName;


            if (model.Role == Domain.Enum.Role.Admin)
            {
                await userManager.AddToRoleAsync(user, "Admin");
            }
            else if (model.Role == Domain.Enum.Role.Coordinator)
            {
                await userManager.AddToRoleAsync(user, "Coordinator");
            }
            else if (model.Role == Domain.Enum.Role.Receptionist)
            {
                await userManager.AddToRoleAsync(user, "Receptionist");
            }
            else if (model.Role == Domain.Enum.Role.Lecture)
            {
                await userManager.AddToRoleAsync(user, "Lecture");
            }
            else
            {
                await userManager.AddToRoleAsync(user, "Student");
            }

            await appDbContext.SaveChangesAsync(cancellationToken);

            return model;
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
            var users = await appDbContext.Users.ToListAsync(cancellationToken);
            var userModels = new List<UserModel>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                var model = mapper.Map<UserModel>(user);

                if (roles.Contains("Admin"))
                    model.Role = Domain.Enum.Role.Admin;
                else if (roles.Contains("Coordinator"))
                    model.Role = Domain.Enum.Role.Coordinator;
                else if (roles.Contains("Receptionist"))
                    model.Role = Domain.Enum.Role.Receptionist;
                else if (roles.Contains("Lecture"))
                    model.Role = Domain.Enum.Role.Lecture;
                else
                    model.Role = Domain.Enum.Role.Student;

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
                .Include(x => x.UserRoles)
                .Where(x => x.Id == userId)
                .FirstOrDefaultAsync(cancellationToken);



            if (user is null)
            {
                throw new Exception();
            }
            var roles = await userManager.GetRolesAsync(user);
            var model = mapper.Map<UserModel>(user);

            if (roles.Any(x => x == "Admin"))
            {
                model.Role = Domain.Enum.Role.Admin;
            }
            else if (roles.Any(x => x == "Coordinator"))
            {
                model.Role = Domain.Enum.Role.Coordinator;
            }
            else if (roles.Any(x => x == "Receptionist"))
            {
                model.Role = Domain.Enum.Role.Receptionist;
            }
            else if (roles.Any(x => x == "Lecture"))
            {
                model.Role = Domain.Enum.Role.Lecture;
            }
            else
            {
                model.Role = Domain.Enum.Role.Student;
            }

            return model;

        }
    }
}