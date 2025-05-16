using EcommerceStore.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcommerceStore.Data
{
    public class DbSeeder
    {
        private readonly ApplicationDbContext _context;
        
        public DbSeeder(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task SeedDataAsync()
        {
            // Apply migrations
            await _context.Database.MigrateAsync();
            
            // Seed categories if none exist
            if (!await _context.Categories.AnyAsync())
            {
                var categories = new List<Category>
                {
                    new Category { Name = "Electronics", Description = "Electronic devices and gadgets" },
                    new Category { Name = "Clothing", Description = "Shirts, pants, dresses, and other apparel" },
                    new Category { Name = "Books", Description = "Fiction, non-fiction, and reference books" },
                    new Category { Name = "Home & Kitchen", Description = "Home essentials and kitchen supplies" },
                    new Category { Name = "Sports", Description = "Sports equipment and accessories" }
                };
                
                await _context.Categories.AddRangeAsync(categories);
                await _context.SaveChangesAsync();
            }
            
            // Seed admin user if none exist
            if (!await _context.Users.AnyAsync(u => u.Role == "Admin"))
            {
                var adminUser = new User
                {
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };
                
                await _context.Users.AddAsync(adminUser);
                await _context.SaveChangesAsync();
            }
            //Seed 2 users
            if (!await _context.Users.AnyAsync())
            {
                var users = new List<User>
                {
                    new User { Username = "user1", Email = "user1@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"), Role = "User", CreatedAt = DateTime.UtcNow },
                };
            }
            if (!await _context.Users.AnyAsync())
            {
                var users = new List<User>
                {
                    new User { Username = "user2", Email = "user2@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("User234!"), Role = "User", CreatedAt = DateTime.UtcNow },
                };
            }
            
            // Seed some products if none exist
            if (!await _context.Products.AnyAsync())
            {
                var categories = await _context.Categories.ToListAsync();
                
                if (categories.Any())
                {
                    var electronicsCategory = categories.First(c => c.Name == "Electronics");
                    var clothingCategory = categories.First(c => c.Name == "Clothing");
                    var booksCategory = categories.First(c => c.Name == "Books");
                    
                    var products = new List<Product>
                    {
                        new Product
                        {
                            Name = "Smartphone",
                            Description = "Latest model smartphone with high-resolution camera",
                            Price = 699.99m,
                            ImageUrl = "https://via.placeholder.com/200x200.png?text=Smartphone",
                            Stock = 50,
                            CategoryId = electronicsCategory.Id,
                            CreatedAt = DateTime.UtcNow
                        },
                        new Product
                        {
                            Name = "Laptop",
                            Description = "Powerful laptop for work and gaming",
                            Price = 1299.99m,
                            ImageUrl = "https://via.placeholder.com/200x200.png?text=Laptop",
                            Stock = 25,
                            CategoryId = electronicsCategory.Id,
                            CreatedAt = DateTime.UtcNow
                        },
                        new Product
                        {
                            Name = "T-Shirt",
                            Description = "Comfortable cotton t-shirt",
                            Price = 19.99m,
                            ImageUrl = "https://via.placeholder.com/200x200.png?text=T-Shirt",
                            Stock = 100,
                            CategoryId = clothingCategory.Id,
                            CreatedAt = DateTime.UtcNow
                        },
                        new Product
                        {
                            Name = "Jeans",
                            Description = "Classic blue jeans",
                            Price = 49.99m,
                            ImageUrl = "https://via.placeholder.com/200x200.png?text=Jeans",
                            Stock = 75,
                            CategoryId = clothingCategory.Id,
                            CreatedAt = DateTime.UtcNow
                        },
                        new Product
                        {
                            Name = "Programming Book",
                            Description = "Learn to code with this comprehensive guide",
                            Price = 34.99m,
                            ImageUrl = "https://via.placeholder.com/200x200.png?text=Programming+Book",
                            Stock = 30,
                            CategoryId = booksCategory.Id,
                            CreatedAt = DateTime.UtcNow
                        }
                    };
                    
                    await _context.Products.AddRangeAsync(products);
                    await _context.SaveChangesAsync();
                }
            }
        }
    }
} 