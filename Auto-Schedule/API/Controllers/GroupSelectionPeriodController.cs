using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupSelectionPeriodController : ControllerBase
    {
        private readonly IGroupSelectionPeriodService _service;
        public GroupSelectionPeriodController(IGroupSelectionPeriodService service)
        {
            _service = service;
        }
        [Authorize(Roles = "Coordinator")]
        [HttpPost]
        public async Task<IActionResult> CreateGroupSelectionPeriod(GroupSelectionPeriodModel groupSelectionPeriodModel, CancellationToken cancellationToken)
        {
            return groupSelectionPeriodModel != null ? Ok(await _service.CreateGroupSelectionPeriodAsync(groupSelectionPeriodModel, cancellationToken)) : BadRequest("Group Selection can not be null!");
           
        }
    }
}
