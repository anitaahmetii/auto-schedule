using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupController : ControllerBase
    {
        private readonly IGroupService _groupService;

        public GroupController(IGroupService groupService)
        {
            _groupService = groupService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateGroupAsync(GroupModel groupModel, CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await _groupService.CreateGroupAsync(groupModel, cancellationToken));
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
                return StatusCode(500, $"A database error occurred while creating the group. {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdGroupAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var groupId = await _groupService.GetByIdGroupAsync(Id, cancellationToken);
                if (groupId == null)
                {
                    throw new ArgumentNullException(nameof(groupId), "Group with the given ID does not exist.");
                }
                return Ok(groupId);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Missing data: {ex.Message}");
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"Invalid input: {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroupAsync(Guid Id, GroupModel groupModel, CancellationToken cancellationToken)
        {
            try
            {
                if (Id != groupModel.Id)
                {
                    return BadRequest("Group ID is Read-Only!");
                }
                var existingCourse = await _groupService.GetByIdGroupAsync(Id, cancellationToken);
                if (existingCourse == null)
                {
                    throw new ArgumentNullException(nameof(groupModel.Id), "No group found with the provided ID.");
                }
                return Ok(await _groupService.UpdateGroupAsync(groupModel, cancellationToken));
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
                return BadRequest($"A database error occurred while updating the group. {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllGroupsAsync(CancellationToken cancellationToken)
        {
            try
            {
                var groups = await _groupService.GetAllGroupsAsync(cancellationToken);
                if (groups == null)
                {
                    return NotFound("No group found.");
                }
                return Ok(groups);
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
        public async Task<IActionResult> DeleteGroupModel(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var groupToBeDeleted = await _groupService.DeleteGroupAsync(Id, cancellationToken);
                if (groupToBeDeleted == null)
                {
                    throw new Exception("No group found to be deleted!");
                }
                return Ok(groupToBeDeleted);
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
                return BadRequest($"A database error occurred while deleting the group. {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"An unexpected error occurred: {ex.Message}");
            }
        }
    }
}
