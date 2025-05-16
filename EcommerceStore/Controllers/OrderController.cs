using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EcommerceStore.Services;
using EcommerceStore.DTOs;

namespace EcommerceStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<ActionResult<OrderDTO>> CreateOrder(OrderDTO orderDto)
        {
            string? userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return BadRequest("Invalid user ID");
            }
            
            try
            {
                var createdOrder = await _orderService.CreateOrderAsync(userId, orderDto);
                if (createdOrder == null)
                {
                    return BadRequest("Order could not be created.");
                }
                return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createdOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetUserOrders()
        {
            string? userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return BadRequest("Invalid user ID");
            }
            
            var orders = await _orderService.GetUserOrdersAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            string? userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return BadRequest("Invalid user ID");
            }
            
            var order = await _orderService.GetOrderByIdAsync(id, userId);
            
            if (order == null)
                return NotFound();
                
            return Ok(order);
        }
    }
} 