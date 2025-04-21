using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IScheduleTypeService
    {
        public Task<List<ScheduleTypeModel>> GetAll(CancellationToken cancellationToken);
        public Task<ScheduleTypeModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<ScheduleTypeModel> CreateOrUpdate(ScheduleTypeModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);
    }
}
