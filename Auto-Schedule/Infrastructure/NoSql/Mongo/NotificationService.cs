using Domain.Interface;
using Domain.Model;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

public class NotificationService : INotificationService
{
    private readonly IMongoCollection<Notification> _collection;

    public NotificationService(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _collection = database.GetCollection<Notification>("notifications");
    }

    public async Task CreateNotificationAsync(Guid userId, string message)
    {
        var notification = new Notification
        {
            UserId = userId,
            Message = message,
            Timestamp = DateTime.UtcNow,
            IsRead = false
        };

        await _collection.InsertOneAsync(notification);
    }

    public async Task<List<Notification>> GetUserNotificationsAsync(Guid userId)
    {
        return await _collection
            .Find(n => n.UserId == userId && !n.IsRead)
            .SortByDescending(n => n.Timestamp)
            .ToListAsync();
    }

    public async Task MarkAllAsReadAsync(Guid userId)
    {
        var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
        await _collection.UpdateManyAsync(n => n.UserId == userId && !n.IsRead, update);
    }
}
