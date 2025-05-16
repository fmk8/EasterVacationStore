using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EcommerceStore.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = "Customer"; // Default role
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
} 