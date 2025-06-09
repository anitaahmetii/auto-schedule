using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService service;
        public LocationController(ILocationService locationService)
        {
            this.service = locationService;
        }
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate(LocationModel model, CancellationToken cancellationToken)
        {
            var location = await service.CreateOrUpdate(model, cancellationToken);

            return Ok(location);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(Guid id, CancellationToken cancellationToken)
        {
            await service.DeleteById(id, cancellationToken);
            return Ok();
        }
        [HttpGet("GetLocationSelectListAsync")]
        public async Task<IActionResult> GetLocationSelectListAsync()
        {
            var model = await service.GetLocationSelectListAsync();
            return Ok(model);
        }
        [HttpGet("count")]
        public async Task<IActionResult> GetCount(CancellationToken cancellationToken)
        {
            var count = await service.GetCount(cancellationToken);
            return Ok(count);
        }
    }

}
