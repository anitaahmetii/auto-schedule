using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateCourseAsync(CourseModel courseModel, CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await _courseService.CreateCourseAsync(courseModel, cancellationToken));
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Missing data: {ex.Message}");
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"Invalid input: {ex.Message}");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "A database error occurred while creating the course.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }
    }
}
