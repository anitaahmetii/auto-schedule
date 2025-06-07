using Domain.Model;

public interface INotificationService
{
    Task CreateNotificationAsync(Guid userId, string message);
    Task<List<Notification>> GetUserNotificationsAsync(Guid userId);
    Task MarkAllAsReadAsync(Guid userId);
}