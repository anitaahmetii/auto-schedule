using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService service;

        public UserController(IUserService userService)
        {
            this.service = userService;
        }

        // Get all users
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var model = await service.GetAll(cancellationToken);
            return Ok(model);
        }

        // Get a specific user by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var model = await service.GetById(id, cancellationToken);
            return Ok(model);
        }

        // Create or update a user
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate(UserModel model, CancellationToken cancellationToken)
        {
            var user = await service.CreateOrUpdate(model, cancellationToken);
            return Ok(user);
        }

        // Delete a user by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(Guid id, CancellationToken cancellationToken)
        {
            await service.DeleteById(id, cancellationToken);
            return Ok();
        }
    }
}
