using Domain.Entities;
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
                return StatusCode(500, $"A database error occurred while creating the course. {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourseAsync(Guid Id, CourseModel courseModel, CancellationToken cancellationToken)
        {
            try
            {
                if (Id != courseModel.Id)
                {
                    return BadRequest("Course ID is Read-Only!");
                }
                var existingCourse = await _courseService.GetByIdCourseAsync(Id, cancellationToken);
                if (existingCourse == null)
                {
                    throw new ArgumentNullException(nameof(courseModel.Id), "No course found with the provided ID.");
                }
                return Ok(await _courseService.UpdateCourseAsync(courseModel, cancellationToken));
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
                return BadRequest($"A database error occurred while updating the course. {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdCourseAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var courseId = await _courseService.GetByIdCourseAsync(Id, cancellationToken);
                if (courseId == null)
                {
                    throw new ArgumentNullException(nameof(courseId), "Course with the given ID does not exist.");
                }
                return Ok(courseId);
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
                return BadRequest($"A database error occurred while updating the course. {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
    }
}
