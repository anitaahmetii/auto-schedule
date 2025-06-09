using Domain.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Domain.Model;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService service;
        private readonly INotificationService notificationService;

        public UserController(IUserService service, INotificationService notificationService)
        {
            this.service = service;
            this.notificationService = notificationService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AuthenticationModel>> Login([FromBody] LoginModel loginModel, CancellationToken cancellationToken)
        {
            var result = await service.LoginAsync(loginModel, cancellationToken);
            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddOrEditUserAsync([FromBody] UserModel model, CancellationToken cancellationToken)
        {
            var updateUser = await service.AddOrEditUserAsync(model, cancellationToken);
            return Ok(updateUser);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var model = await service.GetAllUsersAsync(cancellationToken);
            return Ok(model);
        }

        [HttpGet("admins")]
        public async Task<IActionResult> GetAllAdmins(CancellationToken cancellationToken)
        {
            var model = await service.GetAllAdminsAsync(cancellationToken);
            return Ok(model);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var model = await service.GetUserById(id, cancellationToken);

            return Ok(model);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(Guid id, CancellationToken cancellationToken)
        {
            await service.DeleteUser(id, cancellationToken);
            return Ok();
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest model)
        {
            try
            {
                var result = await service.RefreshTokenAsync(model);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}
