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
        [Authorize(Roles = "Coordinator")]
        [HttpGet]
        public async Task<IActionResult> GetAllGroupSelectionPeriodsAsync(CancellationToken cancellationToken)
        {
            return Ok(await _service.GetAllGroupSelectionPeriodsAsync(cancellationToken));
        }
        [Authorize(Roles = "Coordinator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroupSelectionPeriodAsync(Guid Id, GroupSelectionPeriodModel period, CancellationToken cancellationToken)
        {
            
            return (Id != period.Id) ? BadRequest("Period ID is Read-Only!") : Ok(await _service.UpdateGroupSelectionPeriodAsync(period, cancellationToken));
        }
        [Authorize(Roles = "Coordinator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroupSelectionPeriodAsync(Guid Id, CancellationToken cancellationToken)
        {
            return (Id == Guid.Empty) ? BadRequest("Period ID does not exist!!") : Ok(await _service.DeleteGroupSelectionPeriodAsync(Id, cancellationToken));
        }
    }
}
