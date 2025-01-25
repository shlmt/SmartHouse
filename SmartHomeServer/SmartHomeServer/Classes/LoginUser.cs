using System.ComponentModel.DataAnnotations;

namespace SmartHomeServer.Classes
{
    public class LoginUser
    {
        [EmailAddress]
        public string Email { get; set;}
        public string Password { get; set;}
    }
}
