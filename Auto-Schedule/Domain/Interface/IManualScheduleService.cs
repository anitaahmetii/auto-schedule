using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain.Interface
{
    public interface IManualScheduleService
    {
        Task<ManualScheduleModel> CreateManualScheduleAsync(ManualScheduleModel manualSchedule, CancellationToken cancellationToken);
        Task<List<ManualScheduleModel>> GetAllManualSchedulesAsync(CancellationToken cancellationToken);
        Task<ManualScheduleModel> GetByIdManualScheduleAsync(Guid Id, CancellationToken cancellationToken);
        Task<ManualScheduleModel> UpdateManualScheduleAsync(ManualScheduleModel model, CancellationToken cancellationToken);
        Task<ManualScheduleModel> DeleteManualScheduleAsync(Guid Id, CancellationToken cancellationToken);
        Task<IReadOnlyList<ManualScheduleModel>> GetGroupScheduleAsync(Guid groupId, CancellationToken cancellationToken);
        Task<List<ImportScheduleModel>> ImportScheduleFromExcelAsync(IFormFile file);

    }
}
