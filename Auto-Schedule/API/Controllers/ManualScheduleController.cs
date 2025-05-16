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
    }
}
