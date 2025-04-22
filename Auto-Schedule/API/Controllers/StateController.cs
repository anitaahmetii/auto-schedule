using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StateController : ControllerBase
    {
        private readonly IStateService service;
        public StateController(IStateService stateService)
        {
            this.service = stateService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var model = await service.GetAll(cancellationToken);
            return Ok(model);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var model = await service.GetById(id, cancellationToken);

            return Ok(model);
        }
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate(StateModel model, CancellationToken cancellationToken)
        {
            var state = await service.CreateOrUpdate(model, cancellationToken);

            return Ok(state);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(Guid id, CancellationToken cancellationToken)
        {
            await service.DeleteById(id, cancellationToken);
            return Ok();
        }
        [HttpGet("GetStateSelectListAsync")]
        public async Task<IActionResult> GetStateSelectListAsync(CancellationToken cancellationToken)
        {
            var model = await service.GetStateSelectListAsync(cancellationToken);
            return Ok(model);
        }
    }
}
