using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface ILocationService
    {
        public Task<List<LocationModel>> GetAll(CancellationToken cancellationToken);
        public Task<LocationModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<LocationModel> CreateOrUpdate(LocationModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);

        Task<List<ListItemModel>> GetLocationSelectListAsync(CancellationToken cancellationToken);

    }
}
