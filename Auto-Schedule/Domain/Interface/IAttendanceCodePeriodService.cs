using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IAttendanceCodePeriodService 
    {
        public Task<string?> CreateAttendanceCodePeriodAsync(Guid scheduleId, CancellationToken cancellationToken);
        Task<List<AttendanceCodePeriodModel>> GetAttendanceCodeAsync(CancellationToken cancellationToken);
        Task<string?> DeleteAttendanceCodePeriodAsync(Guid scheduleId, CancellationToken cancellationToken);
    }
}
