using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet("unread/{userId}")]
    public async Task<IActionResult> GetUnread(Guid userId)
    {
        var notifications = await _notificationService.GetUserNotificationsAsync(userId);
        return Ok(notifications);
    }

    [HttpPut("markAllRead/{userId}")]
    public async Task<IActionResult> MarkAllRead(Guid userId)
    {
        await _notificationService.MarkAllAsReadAsync(userId);
        return NoContent();
    }
}
