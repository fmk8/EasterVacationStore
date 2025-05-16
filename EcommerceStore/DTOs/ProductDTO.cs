using System;

namespace EcommerceStore.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public CategoryDTO? Category { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 