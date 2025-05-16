using Application.Services;
using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ManualScheduleController : ControllerBase
    {
        private readonly IManualScheduleService _service;
        public ManualScheduleController(IManualScheduleService service)
        {
            _service = service;
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
    }
}
