using Application.Services;
using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleTypeController : ControllerBase
    {
        private readonly IScheduleTypeService service;

        public ScheduleTypeController(IScheduleTypeService scheduleTypeService)
        {
            this.service = scheduleTypeService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var model = await service.GetAll(cancellationToken);
            return Ok(model);
        }

        // GET: api/ScheduleType/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var model = await service.GetById(id, cancellationToken);
            return Ok(model);
        }

        // POST: api/ScheduleType (Create or Update)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate(ScheduleTypeModel model, CancellationToken cancellationToken)
        {
            var scheduleType = await service.CreateOrUpdate(model, cancellationToken);
            return Ok(scheduleType);
        }

        // DELETE: api/ScheduleType/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(Guid id, CancellationToken cancellationToken)
        {
            await service.DeleteById(id, cancellationToken);
            return Ok();
        }

        [HttpGet("GetScheduleTypeSelectListAsync")]
        public async Task<IActionResult> GetScheduleTypeSelectListAsync(CancellationToken cancellationToken)
        {
            var model = await service.GetScheduleTypeSelectListAsync(cancellationToken);
            return Ok(model);
        }
    }
}
