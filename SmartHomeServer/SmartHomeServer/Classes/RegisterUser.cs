using System.ComponentModel.DataAnnotations;

namespace SmartHomeServer.Classes
{
    public class RegisterUser
    {
        public string UserName { get; set;}
        public string Password { get; set;}

        [EmailAddress]
        public string Email { get; set;}
        public string? Coordinates { get; set; }


    }
}
