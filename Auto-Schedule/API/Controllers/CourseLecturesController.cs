using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseLecturesController : ControllerBase
    {
        private readonly ICourseLecturesService service;

        public CourseLecturesController(ICourseLecturesService courseLecturesService)
        {
            this.service = courseLecturesService;
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
        public async Task<IActionResult> CreateOrUpdate(CourseLecturesModel model, CancellationToken cancellationToken)
        {
            var courseLecture = await service.CreateOrUpdate(model, cancellationToken);
            return Ok(courseLecture);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(Guid id, CancellationToken cancellationToken)
        {
            await service.DeleteById(id, cancellationToken);
            return Ok();
        }
        [HttpGet("GetCourseLectures")]
        public async Task<IActionResult> GetCourseLectures()
        {
            var model = await service.GetCourseLectures();
            return Ok(model);
        }
    }
}
