using System.ComponentModel.DataAnnotations;

namespace SmartHomeServer.Classes
{
    public class LoginUser
    {
        [EmailAddress]
        public string Email { get; set;}
        public string Password { get; set;}
        public bool RememberMe { get; set; } = false;
    }
}
