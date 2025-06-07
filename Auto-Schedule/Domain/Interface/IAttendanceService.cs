using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IAttendanceService
    {
        Task<Boolean> ConfirmPresenceAsync(Guid studentId, Guid scheduleId, string code, CancellationToken cancellationToken);
        Task<List<AttendanceModel>> GetAttendancesAsync(Guid studentId, CancellationToken cancellationToken);
        Task<List<AttendanceModel>> GetStudentAttendancesAsync(Guid lectureId, CancellationToken cancellationToken);
    }
}
