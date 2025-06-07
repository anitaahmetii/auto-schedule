using Domain.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceCodePeriodController : ControllerBase
    {
        private readonly IAttendanceCodePeriodService _service;
        public AttendanceCodePeriodController(IAttendanceCodePeriodService service)
        {
            _service = service;
        }
        //[Authorize(Roles = "Lecture")]
        [HttpPost("{scheduleId}")]
        public async Task<IActionResult> CreateAttendanceCodePeriodAsync(Guid scheduleId, CancellationToken cancellationToken)
        {
            return Ok(await _service.CreateAttendanceCodePeriodAsync(scheduleId, cancellationToken));
        }
        [HttpGet]
        public async Task<IActionResult> GetAttendanceCodeAsync(CancellationToken cancellationToken)
        {
            return Ok(await _service.GetAttendanceCodeAsync(cancellationToken));
        }
        [HttpDelete("{scheduleId}")]
        public async Task<IActionResult> DeleteAttendanceCodePeriodAsync(Guid scheduleId, CancellationToken cancellationToken)
        {
            return Ok(await _service.DeleteAttendanceCodePeriodAsync(scheduleId, cancellationToken));
        }
    }
}
