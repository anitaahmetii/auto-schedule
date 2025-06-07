using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

public class NameIdentifierUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        // This assumes the user ID is stored in the "nameidentifier" claim (typical for JWT sub or nameid)
        return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}
