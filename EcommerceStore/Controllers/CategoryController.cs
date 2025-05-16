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
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoryController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            
            if (category == null)
                return NotFound();
                
            return Ok(category);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategoryDTO>> CreateCategory(CategoryDTO categoryDto)
        {
            var createdCategory = await _categoryService.CreateCategoryAsync(categoryDto);
            return CreatedAtAction(nameof(GetCategory), new { id = createdCategory.Id }, createdCategory);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategoryDTO>> UpdateCategory(int id, CategoryDTO categoryDto)
        {
            var updatedCategory = await _categoryService.UpdateCategoryAsync(id, categoryDto);
            
            if (updatedCategory == null)
                return NotFound();
                
            return Ok(updatedCategory);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            
            if (!result)
                return NotFound();
                
            return NoContent();
        }
    }
} 