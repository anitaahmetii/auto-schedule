using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IUserService
    {
        public Task<List<UserModel>> GetAll(CancellationToken cancellationToken);
        public Task<UserModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<UserModel> CreateOrUpdate(UserModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);
    }
}
