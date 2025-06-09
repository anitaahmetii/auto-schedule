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
    public class LecturerProfileController : ControllerBase
    {
        private readonly ILecturerProfileService _service;

        public LecturerProfileController(ILecturerProfileService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetLecturerProfileAsync(CancellationToken cancellationToken)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized("Invalid user ID.");
            }

            try
            {
                var profile = await _service.GetLecturerProfileAsync(userId, cancellationToken);
                return Ok(profile);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Lecturer profile not found.");
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving the profile.");
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLecturerProfile(Guid id, LecturerProfileModel lecturerProfile, CancellationToken cancellationToken)
        {
            try
            {
                if (id != lecturerProfile.Id)
                {
                    return BadRequest("Lecturer ID is read-only!");
                }

                var updatedProfile = await _service.UpdateLecturerProfileAsync(lecturerProfile, cancellationToken);
                return Ok(updatedProfile);
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
                return BadRequest($"A database error occurred while updating the profile: {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
    }
}
