using Domain.Model;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IUserService
    {
        Task DeleteUser(Guid userId, CancellationToken cancellationToken);
        Task<UserModel> GetUserById(Guid userId, CancellationToken cancellationToken);
        Task<List<UserModel>> GetAllUsersAsync(CancellationToken cancellationToken);
        Task<AuthenticationModel> LoginAsync(LoginModel loginModel, CancellationToken cancellationToken);
        Task<UserModel> AddOrEditUserAsync(UserModel model, CancellationToken cancellationToken);
    }
}
