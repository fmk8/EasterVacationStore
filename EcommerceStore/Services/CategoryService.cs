using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EcommerceStore.Data;
using EcommerceStore.Models;
using EcommerceStore.DTOs;
using System.Linq;

namespace EcommerceStore.Services
{
    public class CategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync()
        {
            var categories = await _context.Categories.ToListAsync();
            
            return categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            });
        }

        public async Task<CategoryDTO?> GetCategoryByIdAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            
            if (category == null)
                return null;
                
            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
        }

        public async Task<CategoryDTO> CreateCategoryAsync(CategoryDTO categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description
            };
            
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            
            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
        }

        public async Task<CategoryDTO?> UpdateCategoryAsync(int id, CategoryDTO categoryDto)
        {
            var category = await _context.Categories.FindAsync(id);
            
            if (category == null)
                return null;
                
            category.Name = categoryDto.Name;
            category.Description = categoryDto.Description;
            
            await _context.SaveChangesAsync();
            
            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            
            if (category == null)
                return false;
                
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            
            return true;
        }
    }
}