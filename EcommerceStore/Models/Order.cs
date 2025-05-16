using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceStore.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        
        [Required]
        public string Status { get; set; } = "Pending"; // Pending, Shipped, Delivered, Canceled
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = new User();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
} 