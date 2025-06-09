using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleSearchController : ControllerBase
    {
        private readonly IScheduleSearchService _service;
        public ScheduleSearchController(IScheduleSearchService service)
        {
            _service = service;
        }
        [HttpPost]
        public async Task<IActionResult> GetSchedulesByFilter(ScheduleSearchModel model, CancellationToken cancellationToken)
        {
            return Ok(await _service.GetSchedulesByFilter(model, cancellationToken));
        }
    }
}
