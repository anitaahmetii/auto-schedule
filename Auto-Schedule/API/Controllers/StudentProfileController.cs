using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentProfileController : ControllerBase
    {
        private readonly IStudentProfileService _service;
        public StudentProfileController(IStudentProfileService service)
        {
            _service = service;
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetStudentProfileAsync(CancellationToken cancellationToken)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized("Invalid user ID");
            }
            try
            {
                var profile = await _service.GetStudentProfileAsync(userId, cancellationToken);
                return Ok(profile);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Student profile not found.");
            }
            catch (Exception ex)
            {
                // Për debug ose log, mund ta logosh error-in këtu
                return StatusCode(500, "An error occurred while retrieving the profile.");
            }
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudentProfile(Guid Id, StudentProfileModel studentProfile, CancellationToken cancellationToken)
        {
            try
            {
                if (Id != studentProfile.Id)
                {
                    return BadRequest("Student ID is Read-Only!");
                }
                return Ok(await _service.UpdateStudentProfileAsync(studentProfile, cancellationToken));
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
                return BadRequest($"A database error occurred while updating the profile. {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpGet("count")]
        public async Task<IActionResult> GetCount(CancellationToken cancellationToken)
        {
            var count = await _service.GetCount(cancellationToken);
            return Ok(count);
        }
    }
}
