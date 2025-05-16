using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class HallController : ControllerBase
    {
        private readonly IHallService service;
        public HallController(IHallService hallsService)
        {
            this.service = hallsService;
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
        public async Task<IActionResult> CreateOrUpdate(HallModel model, CancellationToken cancellationToken)
        {
            var hall = await service.CreateOrUpdate(model, cancellationToken);

            return Ok(hall);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(Guid id, CancellationToken cancellationToken)
        {
            await service.DeleteById(id, cancellationToken);
            return Ok();
        }
        [HttpGet("GetHallsSelectListAsync")]
        public async Task<IActionResult> GetHallsSelectListAsync(CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await service.GetHallsSelectListAsync(cancellationToken));
            }
            catch (OperationCanceledException)
            {
                return StatusCode(StatusCodes.Status499ClientClosedRequest, "The request was cancelled.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"Invalid argument: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving halls.");
            }
        }

    }
}


