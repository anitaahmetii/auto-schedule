using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;
        private readonly IMapper mapper;

        public UserService(UserManager<User> userManager, IMapper mapper)
        {
            this.userManager = userManager;
            this.mapper = mapper;
        }

        public async Task<UserModel> CreateOrUpdate(UserModel model, CancellationToken cancellationToken)
        {
            User user;

            if (model.Id == null)
            {
                // Krijoni një përdorues të ri
                user = new User
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber
                };

                var result = await userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    throw new Exception("Përpjekja për të krijuar përdoruesin ka dështuar.");
                }
            }
            else
            {
                // Përditësoni përdoruesin ekzistues
                user = await userManager.FindByIdAsync(model.Id.ToString());
                if (user != null)
                {
                    user = mapper.Map(model, user);

                    // Nëse ka ndryshuar password-i, mund të ri-dërgoni dhe të përditësoni
                    if (!string.IsNullOrEmpty(model.Password))
                    {
                        var token = await userManager.GeneratePasswordResetTokenAsync(user);
                        var result = await userManager.ResetPasswordAsync(user, token, model.Password);
                        if (!result.Succeeded)
                        {
                            throw new Exception("Dështoi përditësimi i fjalëkalimit.");
                        }
                    }
                }
            }

            return mapper.Map<UserModel>(user);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByIdAsync(Id.ToString());

            if (user != null)
            {
                var result = await userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    throw new Exception("Dështoi për fshirjen e përdoruesit.");
                }
            }
        }

        public async Task<List<UserModel>> GetAll(CancellationToken cancellationToken)
        {
            var users = userManager.Users.ToList();
            return mapper.Map<List<UserModel>>(users);
        }

        public async Task<UserModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByIdAsync(Id.ToString());
            return mapper.Map<UserModel>(user);
        }
    }
}