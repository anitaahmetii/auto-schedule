using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IHallService
    {
        public Task<List<HallModel>> GetAll(CancellationToken cancellationToken);
        public Task<HallModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<HallModel> CreateOrUpdate(HallModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);
        public Task<List<ListItemModel>> GetHallsSelectListAsync(CancellationToken cancellationToken);
    }
}
