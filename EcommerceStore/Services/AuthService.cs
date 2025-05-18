using EcommerceStore.Data;
using EcommerceStore.DTOs;
using EcommerceStore.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace EcommerceStore.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        
        public AuthService(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }
        
        public async Task<UserDTO> RegisterAsync(RegisterDTO registerDto)
        {
            // Check if email is already in use
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                throw new Exception("Email already in use");
            }
            
            // Validate password complexity
            if (registerDto.Password.Length < 8)
            {
                throw new Exception("Password must be at least 8 characters");
            }
            
            // Create new user
            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "Customer" // Default role
            };
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            // Return user DTO without password
            return new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }
        
        public async Task<(UserDTO, string)> LoginAsync(LoginDTO loginDto)
        {
            // Find user by email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);
                
            if (user == null)
            {
                throw new Exception("Invalid email or password");
            }
            
            // Verify password
            bool passwordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            
            if (!passwordValid)
            {
                throw new Exception("Invalid email or password");
            }
            
            // Generate JWT token
            var token = _jwtService.GenerateToken(user);
            
            // Return user DTO and token
            return (new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            }, token);
        }
    }
} 