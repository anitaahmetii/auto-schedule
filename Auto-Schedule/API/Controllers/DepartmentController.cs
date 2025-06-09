using Application.Services;
using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService service;
        public DepartmentController(IDepartmentService service)
        {
            this.service = service;
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
        public async Task<IActionResult> CreateOrUpdate(DepartmentModel model, CancellationToken cancellationToken)
        {
            var state = await service.CreateOrUpdate(model, cancellationToken);

            return Ok(state);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(Guid id, CancellationToken cancellationToken)
        {
            await service.DeleteById(id, cancellationToken);
            return Ok();
        }

        [HttpGet("GetDepartmentSelectListAsync")]
        public async Task<IActionResult> GetDepartmentSelectListAsync(CancellationToken cancellationToken)
        {
            var model = await service.GetDepartmentsSelectListAsync(cancellationToken);
            return Ok(model);
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchDepartments([FromQuery] string searchTerm, [FromQuery] string? sortBy, [FromQuery] string? searchField)
        {
            var result = await service.SearchDepartments(searchTerm, sortBy, searchField);
            return Ok(result);
        }
        [HttpGet("GetDepartmentsSelectListAsync")]
        public async Task<IActionResult> GetDepartmentsSelectListAsync(CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await service.GetDepartmentsSelectListAsync(cancellationToken));
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
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving departments.");
            }
        }
    }
}