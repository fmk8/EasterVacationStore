using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceStore.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public string ImageUrl { get; set; } = string.Empty;
        
        [Required]
        public int Stock { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Foreign key
        public int CategoryId { get; set; }
        
        // Navigation properties
        public virtual Category Category { get; set; } = new Category();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
} 