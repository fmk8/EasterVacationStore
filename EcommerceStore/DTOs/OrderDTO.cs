using System;
using System.Collections.Generic;

namespace EcommerceStore.DTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public List<OrderItemDTO> Items { get; set; } = new List<OrderItemDTO>();
    }

    public class OrderItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public ProductDTO? Product { get; set; }
    }
} 