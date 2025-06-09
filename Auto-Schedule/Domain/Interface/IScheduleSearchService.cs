using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IScheduleSearchService
    {
        Task<List<ManualScheduleModel>> GetSchedulesByFilter(ScheduleSearchModel model, CancellationToken cancellationToken);
    }
}
