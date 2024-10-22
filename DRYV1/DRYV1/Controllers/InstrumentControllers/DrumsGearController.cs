using Microsoft.AspNetCore.Mvc;
using DRYV1.Data;
using DRYV1.Models;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace DRYV1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrumsGearController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DrumsGearController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var drums = await _context.Drums.ToListAsync();
            return Ok(drums);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var drum = await _context.Drums.FindAsync(id);
            if (drum == null)
            {
                return NotFound();
            }
            return Ok(drum);
        }

        [HttpPost]
        public async Task<IActionResult> Create(DrumsGear drumGear)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == drumGear.UserId);
            if (!userExists)
            {
                return BadRequest("Invalid UserId");
            }

            _context.Drums.Add(drumGear);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = drumGear.Id }, drumGear);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, DrumsGear drumGear)
        {
            if (id != drumGear.Id)
            {
                return BadRequest();
            }

            _context.Entry(drumGear).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var drum = await _context.Drums.FindAsync(id);
            if (drum == null)
            {
                return NotFound();
            }

            _context.Drums.Remove(drum);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}