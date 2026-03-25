using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaterProject.API.Data;

namespace WaterProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _context;
        
        public BookController(BookDbContext temp)
        {
            _context = temp;
        }

        [HttpGet]
        public IActionResult Get(int pageNum = 1, int pageSize = 5, string sortOrder = "asc", string category = "")
        {
            // Start with an IQueryable — nothing hits the DB yet
            var query = _context.Books.AsQueryable();

            // Filter by category if one was selected (empty string means "all categories")
            if (!string.IsNullOrEmpty(category))
                query = query.Where(b => b.Category == category);

            // Apply sorting based on the sortOrder parameter
            if (sortOrder == "desc")
                query = query.OrderByDescending(b => b.Title);
            else
                query = query.OrderBy(b => b.Title);

            // Count BEFORE pagination so we know the total for the frontend
            var totalNumBooks = query.Count();

            // Skip past previous pages, then take only this page's records
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { books, totalNumBooks });
        }

        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            var categories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }
    }
}
