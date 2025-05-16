using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EcommerceStore.Data;
using EcommerceStore.Models;
using EcommerceStore.DTOs;
using System.Linq;

namespace EcommerceStore.Services
{
    public class ProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDTO>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .ToListAsync();
            
            return products.Select(MapToDTO);
        }

        public async Task<IEnumerable<ProductDTO>> GetProductsByCategoryAsync(int categoryId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryId == categoryId)
                .Include(p => p.Category)
                .ToListAsync();
            
            return products.Select(MapToDTO);
        }

        public async Task<ProductDTO?> GetProductByIdAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if (product == null)
                return null;
                
            return MapToDTO(product);
        }

        public async Task<ProductDTO?> CreateProductAsync(ProductDTO productDto)
        {
            var category = await _context.Categories.FindAsync(productDto.CategoryId);
            if (category == null)
                return null;
                
            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                ImageUrl = productDto.ImageUrl,
                CategoryId = productDto.CategoryId,
                Stock = productDto.Stock
            };
            
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            
            // Reload the product with the category included
            product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == product.Id);

            if (product == null)
                return null;
                
            return MapToDTO(product);
        }

        public async Task<ProductDTO?> UpdateProductAsync(int id, ProductDTO productDto)
        {
            var product = await _context.Products.FindAsync(id);
            
            if (product == null)
                return null;
                
            // Verify the category exists
            if (productDto.CategoryId != product.CategoryId)
            {
                var category = await _context.Categories.FindAsync(productDto.CategoryId);
                if (category == null)
                    return null;
            }
                
            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.ImageUrl = productDto.ImageUrl;
            product.CategoryId = productDto.CategoryId;
            product.Stock = productDto.Stock;
            
            await _context.SaveChangesAsync();
            
            // Reload the product with the category included
            product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == product.Id);

            if (product == null)
                return null;
                
            return MapToDTO(product);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            
            if (product == null)
                return false;
                
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            
            return true;
        }
        
        private static ProductDTO MapToDTO(Product product)
        {
            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                Stock = product.Stock,
                Category = product.Category != null ? new CategoryDTO
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name,
                    Description = product.Category.Description
                } : null
            };
        }
    }
}