using Domain.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _service;
        public AttendanceController(IAttendanceService service)
        {
            _service = service;
        }
        [Authorize(Roles = "Student")]
        [HttpGet("confirm")]
        public async Task<IActionResult> ConfirmPresenceAsync(Guid studentId, Guid scheduleId, string code, CancellationToken cancellationToken)
        {
            return Ok(await _service.ConfirmPresenceAsync(studentId, scheduleId, code, cancellationToken));
        }
        [Authorize(Roles = "Student")]
        [HttpGet("{studentId}")]
        public async Task<IActionResult> GetAttendancesAsync(Guid studentId, CancellationToken cancellationToken)
        {
            return Ok(await _service.GetAttendancesAsync(studentId, cancellationToken));
        }
        [Authorize(Roles = "Lecture")]
        [HttpGet("studentattendances/{lectureId}")]
        public async Task<IActionResult> GetStudentAttendancesAsync(Guid lectureId, CancellationToken cancellationToken)
        {
            return Ok(await _service.GetStudentAttendancesAsync(lectureId, cancellationToken));
        }
    }
}
