using Microsoft.AspNetCore.Mvc;
using DRYV1.Data;
using DRYV1.Models;
using DRYV1.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System;

namespace DRYV1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GuitarGearController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GuitarGearController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var guitars = await _context.Guitars.ToListAsync();
            return Ok(guitars);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var guitar = await _context.Guitars.FindAsync(id);
            if (guitar == null)
            {
                return NotFound();
            }
            return Ok(guitar);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] GuitarGear guitarGear, [FromForm] List<IFormFile> imageFiles)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == guitarGear.UserId);
            if (!userExists)
            {
                return BadRequest("Invalid UserId");
            }

            guitarGear.ListingDate = DateTime.UtcNow;

            if (imageFiles != null && imageFiles.Count > 0)
            {
                try
                {
                    var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
                    guitarGear.ImagePaths = await ImageUploadHelper.UploadImagesAsync(imageFiles, "assets", baseUrl);
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            _context.Guitars.Add(guitarGear);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = guitarGear.Id }, guitarGear);
        }

        

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var guitar = await _context.Guitars.FindAsync(id);
            if (guitar == null)
            {
                return NotFound();
            }

            _context.Guitars.Remove(guitar);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}