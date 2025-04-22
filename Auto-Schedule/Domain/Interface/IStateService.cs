using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IStateService
    {
        public Task<List<StateModel>> GetAll(CancellationToken cancellationToken);
        public Task<StateModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<StateModel> CreateOrUpdate(StateModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);
        public Task<List<ListItemModel>> GetStateSelectListAsync(CancellationToken cancellationToken);

    }
}
