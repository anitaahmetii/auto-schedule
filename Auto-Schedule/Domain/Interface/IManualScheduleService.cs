using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Domain.Enum;

namespace Domain.Interface
{
    public interface IManualScheduleService
    {
        Task<ManualScheduleModel> CreateManualScheduleAsync(ManualScheduleModel manualSchedule, CancellationToken cancellationToken);
        Task<List<ManualScheduleModel>> GetAllManualSchedulesAsync(CancellationToken cancellationToken);
        Task<ManualScheduleModel> GetByIdManualScheduleAsync(Guid Id, CancellationToken cancellationToken);
        Task<ManualScheduleModel> UpdateManualScheduleAsync(ManualScheduleModel model, CancellationToken cancellationToken);
        Task<ManualScheduleModel> DeleteManualScheduleAsync(Guid Id, CancellationToken cancellationToken);
        Task<List<ImportScheduleModel>> ImportScheduleFromExcelAsync(IFormFile file);
        Task<List<ManualScheduleModel>> GetSchedulesByDay(Days day, CancellationToken cancellationToken);
        Task<ManualScheduleModel> CancelSchedule(Guid id, CancellationToken cancellationToken);
        Task<ManualScheduleModel> RestoreSchedule(Guid id, CancellationToken cancellationToken);
        Task<List<ManualScheduleModel>> GetCanceledSchedules(CancellationToken cancellationToken);

    }
}
