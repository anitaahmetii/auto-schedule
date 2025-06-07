using Domain.Model;

namespace Domain.Model
{
    public class AuthenticationModel
    {
        public string Token { get; set; } = default!;
        public string RefreshToken { get; set; } = default!;
        public DateTime ExpiresAt { get; set; }
        public UserModel UserData { get; set; } = default!;
        public string UserRole { get; set; } = default!;
        public List<Notification>? Notifications { get; set; }

    }
}