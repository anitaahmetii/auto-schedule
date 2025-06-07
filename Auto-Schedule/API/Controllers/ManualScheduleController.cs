using Application.Services;
using Domain.Enum;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ManualScheduleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IManualScheduleService _service;
        public ManualScheduleController(AppDbContext context, IManualScheduleService service, INotificationService notificationService, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _service = service;
            _notificationService = notificationService;
            _hubContext = hubContext;
        }
        [HttpPost]
        public async Task<IActionResult> CreateManualScheduleAsync(ManualScheduleModel manualSchedule, CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await _service.CreateManualScheduleAsync(manualSchedule, cancellationToken));
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Missing data: {ex.Message}");
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"Invalid input: {ex.Message}");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"A database error occurred while creating the schedule. {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllManualSchedulesAsync(CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await _service.GetAllManualSchedulesAsync(cancellationToken));
            }
            catch (OperationCanceledException)
            {
                return StatusCode(499, "Request was cancelled by the client.");
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, "You are not authorized to access this resource.");
            }
            catch (TimeoutException)
            {
                return StatusCode(504, "The operation timed out. Please try again later.");
            }
            catch (NullReferenceException)
            {
                return StatusCode(500, "A required object was not properly initialized.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest($"Invalid operation: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdManualScheduleAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await _service.GetByIdManualScheduleAsync(Id, cancellationToken));
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Missing data: {ex.Message}");
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"Invalid input: {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateManualScheduleAsync(Guid Id, ManualScheduleModel manualSchedule, CancellationToken cancellationToken)
        {
            try
            {
                if (Id != manualSchedule.Id)
                {
                    return BadRequest("Schedule ID is Read-Only!");
                }
                var existingSchedule = await _service.GetByIdManualScheduleAsync(Id, cancellationToken);
                if (existingSchedule == null)
                {
                    throw new ArgumentNullException(nameof(manualSchedule.Id), "No schedule found with the provided ID.");

                }
                return Ok(await _service.UpdateManualScheduleAsync(manualSchedule, cancellationToken));
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Missing data: {ex.Message}");
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"Invalid input: {ex.Message}");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest($"A database error occurred while updating the schedule. {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteManualScheduleAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await _service.DeleteManualScheduleAsync(Id, cancellationToken));
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Missing data: {ex.Message}");
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"Invalid input: {ex.Message}");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest($"A database error occurred while deleting the schedue. {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpGet("group/{groupId}")]
        public async Task<IActionResult> GetGroupScheduleAsync(Guid groupId, CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await _service.GetGroupScheduleAsync(groupId, cancellationToken));
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Missing data: {ex.Message}");
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"Invalid input: {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpPost("upload")]
        public async Task<IActionResult> ImportScheduleFromExcelAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var schedule = await _service.ImportScheduleFromExcelAsync(file);
            return Ok(schedule);
        }

        [Authorize(Roles = "Student")]
        [HttpPost("selectGroup")]
        public async Task<IActionResult> SelectGroupByStudent(Guid studentId, Guid groupId, CancellationToken cancellationToken)
        {
            try
            {
                var schedules = await _service.SelectGroupByStudent(studentId, groupId, cancellationToken);
                return Ok(schedules);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpGet("dailyschedules")]
        public async Task<IActionResult> GetDailySchedules(CancellationToken cancellationToken)
        {
            return Ok(await _service.GetDailySchedules(cancellationToken));
        }

        [HttpGet("countSchedule")]
        public async Task<IActionResult> CountSchedule(CancellationToken cancellationToken)
        {
            var count = await _service.CountSchedule(cancellationToken);
            return Ok(count);
        }
        [HttpGet("by-day/{day}")]
        public async Task<IActionResult> GetSchedulesByDay(Days day, CancellationToken cancellationToken)
        {
            var schedules = await _service.GetSchedulesByDay(day, cancellationToken);
            return Ok(schedules);
        }

        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelSchedule(Guid id, CancellationToken cancellationToken)
        {
            var result = await _service.CancelSchedule(id, cancellationToken);
            if (result == null)
                return NotFound();

            // Get the schedule again if needed to access users (or return it from the service)
            var schedule = await _context.Schedules
                .Include(x => x.CourseLectures)
                .ThenInclude(cl => cl.Course)
                .Include(x => x.CourseLectures)
                .ThenInclude(cl => cl.User)
                .Include(x => x.Group)
                .ThenInclude(g => g.Students)
                .Include(x => x.Halls)
                .Include(x => x.Location)
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

            var courseName = schedule.CourseLectures?.Course?.Name ?? "the course";
            var hallName = schedule.Halls?.Name ?? "a hall";
            var locationName = schedule.Location?.Name ?? "your campus";

            var start = DateTime.Parse(result.StartTime).ToString("HH:mm", CultureInfo.InvariantCulture);
            var end = DateTime.Parse(result.EndTime).ToString("HH:mm", CultureInfo.InvariantCulture);
            var day = schedule.Day;

            var lecturer = schedule.CourseLectures.User;
            var lecturerMessage = $"📅 Hello {lecturer.UserName}, your class scheduled on {day} from {start} to {end} for the course \"{courseName}\" in {hallName}, {locationName} has been canceled.";
            await _notificationService.CreateNotificationAsync(lecturer.Id, lecturerMessage);
            await _hubContext.Clients.User(lecturer.Id.ToString()).SendAsync("ReceiveNotification", lecturerMessage);


            // Notify students (if applicable)
            if (schedule.Group?.Students != null)
            {
                foreach (var student in schedule.Group.Students)
                {
                    var message = $"📅 Hello {student.UserName}, your class scheduled on {day} from {start} to {end} for the course \"{courseName}\" in {hallName}, {locationName} has been canceled.";
                    await _notificationService.CreateNotificationAsync(student.Id, message);
                    await _hubContext.Clients.User(student.Id.ToString()).SendAsync("ReceiveNotification", message, cancellationToken: cancellationToken);
                }
            }

            return Ok(result);
        }
        [HttpPut("restore/{id}")]
        public async Task<IActionResult> RestoreSchedule(Guid id, CancellationToken cancellationToken)
        {
            var result = await _service.RestoreSchedule(id, cancellationToken);
            if (result == null)
                return NotFound();

            return Ok(result);
        }
        [HttpGet("canceled")]
        public async Task<IActionResult> GetCanceledSchedules(CancellationToken cancellationToken)
        {
            var schedule = await _service.GetCanceledSchedules(cancellationToken);

            return Ok(schedule);
        }

        [HttpGet("canceled/count")]
        public async Task<IActionResult> CountCanceledSchedules(CancellationToken cancellationToken)
        {
            var count = await _service.CountCanceledSchedule(cancellationToken);
            return Ok(count);
        }
        [HttpGet("scheudlesOfWeek")]
        public async Task<Dictionary<string, int>> CountSchedulesByDayAsync(CancellationToken cancellationToken)
        {
            var schedules = await _service.CountSchedulesByDayAsync(cancellationToken);
            return schedules;
        }
    }
}
