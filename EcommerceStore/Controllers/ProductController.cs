using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EcommerceStore.Services;
using EcommerceStore.DTOs;

namespace EcommerceStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsByCategory(int categoryId)
        {
            var products = await _productService.GetProductsByCategoryAsync(categoryId);
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            
            if (product == null)
                return NotFound();
                
            return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDTO>> CreateProduct(ProductDTO productDto)
        {
            var createdProduct = await _productService.CreateProductAsync(productDto);
            
            if (createdProduct == null)
                return BadRequest("Invalid category ID");
                
            return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDTO>> UpdateProduct(int id, ProductDTO productDto)
        {
            var updatedProduct = await _productService.UpdateProductAsync(id, productDto);
            
            if (updatedProduct == null)
                return NotFound();
                
            return Ok(updatedProduct);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var result = await _productService.DeleteProductAsync(id);
            
            if (!result)
                return NotFound();
                
            return NoContent();
        }
    }
} 