using Microsoft.AspNetCore.SignalR;

public class NotificationHub : Hub
{
    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"✅ SignalR Connected: {Context.ConnectionId}");
        Console.WriteLine($"🧾 UserIdentifier: {Context.UserIdentifier}");

        return base.OnConnectedAsync();
    }

    public async Task SendNotificationToUser(string userId, string message)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", message);
    }
}
