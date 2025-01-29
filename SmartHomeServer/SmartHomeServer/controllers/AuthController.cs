using Microsoft.AspNetCore.Mvc;
using SmartHomeServer.Classes;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace SmartHomeServer.controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IConfiguration _configuration;
        private MyDbContext _dbContext;

        public AuthController(IConfiguration configration, MyDbContext myDbContext)
        {
            _configuration = configration;
            _dbContext = myDbContext;
        }

        [Authorize]
        [HttpGet]
        [Route("")]
        public async Task<ActionResult> MyDetails()
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!String.IsNullOrEmpty(userId))
            {
                User user = await GetUserById(new Guid(userId));
                if(user != null)
                {
                    user.Password = null;
                    return Ok(user);
                }
            }
            return Unauthorized();
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] LoginUser loginUser)
        {
            if(String.IsNullOrEmpty(loginUser.Email) || String.IsNullOrEmpty(loginUser.Password))
            {
                return BadRequest("username & password can't be null or empty");
            }
            User user = await _dbContext.Users.Where(u => u.Email == loginUser.Email).FirstOrDefaultAsync();
            if (user != null)
            {
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginUser.Password, user.Password);
                if(isPasswordValid)
                {
                    user.Password = null;
                    string token = GenerateJwtToken(user);
                    var options = new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None };
                    if (loginUser.RememberMe) options.Expires = DateTime.UtcNow.AddDays(7);
                    Response.Cookies.Append("X-Access-Token", token, options);
                    return Ok(user);
                }
            }
            return NotFound();
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult> Register([FromBody] RegisterUser registerUser)
        {
            if(String.IsNullOrEmpty(registerUser.UserName)
                || String.IsNullOrEmpty(registerUser.Email)
                || String.IsNullOrEmpty(registerUser.Password))
            {
                return BadRequest();
            }
            if(GetStrengthPassword(registerUser.Password) < 3)
            {
                return BadRequest("the password is weak");
            }
            User newUser = new User()
            {
                Username = registerUser.UserName,
                Password = BCrypt.Net.BCrypt.HashPassword(registerUser.Password),
                IsActive = true,
                Email = registerUser.Email,
                CreatedAt = DateTime.Now,
                Role = "Standard",
                CreditCard = null
            };
            await _dbContext.Users.AddAsync(newUser);
            await _dbContext.SaveChangesAsync();
            User user = await GetUserById(newUser.Id);
            if(user != null)
            {
                user.Password = null;
                string token = GenerateJwtToken(user);
                Response.Cookies.Append("X-Access-Token", token, new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None });
                return Ok(user);
            }
            return StatusCode(500);
        }

        [HttpGet]
        [Route("logout")]
        public async Task<ActionResult> Logout()
        {
            Response.Cookies.Append("X-Access-Token", "", new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(-1),
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });
            return Ok();
        }

        private async Task<User> GetUserById(Guid id)
        {
            return await _dbContext.Users.FindAsync(id);
        }

        private int GetStrengthPassword(string pass)
        {
            var result = Zxcvbn.Core.EvaluatePassword(pass);
            return result.Score;
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration.GetSection("key").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role),
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
