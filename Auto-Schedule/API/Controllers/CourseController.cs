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
        [HttpGet]
        public async Task<IActionResult> GetAllCoursesAsync(CancellationToken cancellationToken)
        {
            try
            {
                var courses = await _courseService.GetAllCoursesAsync(cancellationToken);
                if (courses == null)
                {
                    return NotFound("No courses found.");
                }
                return Ok(courses);
            }
            catch (OperationCanceledException)
            {
                return StatusCode(499, "Request was cancelled by the client.");
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, "You are not authorized to access this resource.");
            }
            catch (TimeoutException)
            {
                return StatusCode(504, "The operation timed out. Please try again later.");
            }
            catch (NullReferenceException)
            {
                return StatusCode(500, "A required object was not properly initialized.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest($"Invalid operation: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourseModel(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var courseToBeDeleted = await _courseService.DeleteCourseAsync(Id, cancellationToken);
                if (courseToBeDeleted == null)
                {
                    throw new Exception("No course found to be deleted!");
                }
                return Ok(courseToBeDeleted);
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
                return BadRequest($"A database error occurred while deleting the course. {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }

        }

        [HttpGet("GetCourseSelectListAsync")]
        public async Task<IActionResult> GetCourseSelectListAsync(CancellationToken cancellationToken)
        {
            var model = await _courseService.GetCourseSelectListAsync(cancellationToken);
            return Ok(model);
        }
    }
}
