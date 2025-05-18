using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EcommerceStore.Data;
using EcommerceStore.Models;
using EcommerceStore.DTOs;

namespace EcommerceStore.Services
{
    public class OrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDTO?> CreateOrderAsync(int userId, OrderDTO orderDto)
        {
            // Begin transaction
            using var transaction = await _context.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.ReadCommitted,
                cancellationToken: default);
            
            try
            {
                // Create the order
                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    Status = "Pending",
                    Total = 0 
                };
                
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                
                decimal orderTotal = 0;
                var orderItems = new List<OrderItem>();
                
                // Process each order item
                foreach (var item in orderDto.Items)
                {
                    // Get the product to verify stock and price
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null)
                        throw new Exception($"Product with ID {item.ProductId} not found");
                        
                    if (product.Stock < item.Quantity)
                        throw new Exception($"Not enough stock for product {product.Name}");
                        
                    // Create order item
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };
                    
                    orderItems.Add(orderItem);
                    orderTotal += product.Price * item.Quantity;
                    
                    // Update product stock
                    product.Stock -= item.Quantity;
                }
                
                // Add all order items to database
                _context.OrderItems.AddRange(orderItems);
                
                // Update order total
                order.Total = orderTotal;
                
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                
                // Return the created order as DTO
                return new OrderDTO
                {
                    Id = order.Id,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    Total = order.Total,
                    Items = orderItems.Select(oi => new OrderItemDTO
                    {
                        ProductId = oi.ProductId,
                        Quantity = oi.Quantity
                    }).ToList()
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<IEnumerable<OrderDTO?>> GetUserOrdersAsync(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
                
            return orders.Select(o => new OrderDTO
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                Status = o.Status,
                Total = o.Total,
                Items = o.OrderItems.Select(oi => new OrderItemDTO
                {
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    Product = new ProductDTO
                    {
                        Id = oi.Product.Id,
                        Name = oi.Product.Name,
                        Price = oi.Product.Price,
                        ImageUrl = oi.Product.ImageUrl
                    }
                }).ToList()
            });
        }

        public async Task<OrderDTO?> GetOrderByIdAsync(int id, int userId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);
                
            if (order == null)
                return null;
                
            return new OrderDTO
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                Total = order.Total,
                Items = order.OrderItems.Select(oi => new OrderItemDTO
                {
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    Product = new ProductDTO
                    {
                        Id = oi.Product.Id,
                        Name = oi.Product.Name,
                        Price = oi.Product.Price,
                        ImageUrl = oi.Product.ImageUrl
                    }
                }).ToList()
            };
        }
    }
} 