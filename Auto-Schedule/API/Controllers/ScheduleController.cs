using Domain.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService scheduleService;

        public ScheduleController(IScheduleService scheduleService)
        {
            this.scheduleService = scheduleService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> ImportScheduleFromExcelAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var schedule = await scheduleService.ImportScheduleFromExcelAsync(file);
            return Ok(schedule);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var schedule = await scheduleService.GetAll(cancellationToken);

            return Ok(schedule);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var model = await scheduleService.GetById(id, cancellationToken);

            return Ok(model);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(Guid id, CancellationToken cancellationToken)
        {
            await scheduleService.DeleteById(id, cancellationToken);
            return Ok();
        }
    }
}
