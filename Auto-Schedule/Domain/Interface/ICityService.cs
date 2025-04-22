using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface ICityService
    {
        public Task<List<CityModel>> GetAll(CancellationToken cancellationToken);
        public Task<CityModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<CityModel> CreateOrUpdate(CityModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);
    }
}
