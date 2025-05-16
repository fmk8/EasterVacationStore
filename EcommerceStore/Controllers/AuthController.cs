using EcommerceStore.DTOs;
using EcommerceStore.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace EcommerceStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        
        public AuthController(AuthService authService)
        {
            _authService = authService;
        }
        
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto)
        {
            try
            {
                var user = await _authService.RegisterAsync(registerDto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDTO loginDto)
        {
            try
            {
                var (user, token) = await _authService.LoginAsync(loginDto);
                return Ok(new { user, token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
} 