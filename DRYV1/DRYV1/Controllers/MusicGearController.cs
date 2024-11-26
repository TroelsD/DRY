using Microsoft.AspNetCore.Mvc;
using DRYV1.Data;
using DRYV1.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System;
using DRYV1.Services;

namespace DRYV1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusicGearController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MusicGearController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(string query, string type = "")
        {
            var keywords = query.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var results = await _context.MusicGear
                .Where(g => (string.IsNullOrEmpty(type) ||
                             (g is GuitBassGear && ((GuitBassGear)g).GuitBassType.ToLower().Contains(type.ToLower())) ||
                             (g is DrumsGear && ((DrumsGear)g).DrumsGearType.ToLower().Contains(type.ToLower()))) &&
                            keywords.All(k => g.Brand.ToLower().Contains(k) ||
                                              g.Model.ToLower().Contains(k) ||
                                              g.Year.ToString().Contains(k) ||
                                              g.Description.ToLower().Contains(k) ||
                                              g.Location.ToLower().Contains(k) ||
                                              (g is GuitBassGear && ((GuitBassGear)g).GuitBassType.ToLower().Contains(k)) ||
                                              (g is DrumsGear && ((DrumsGear)g).DrumsGearType.ToLower().Contains(k))))
                .ToListAsync();

            if (!results.Any())
            {
                return NotFound("No matching records found.");
            }

            return Ok(results);
        }
        
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                return NotFound("User not found.");
            }

            var musicGear = await _context.MusicGear
                .Where(g => g.UserId == userId)
                .ToListAsync();

            if (!musicGear.Any())
            {
                return NotFound("No music gear found for this user.");
            }

            return Ok(musicGear);
        }
        
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] MusicGearUpdateDTO updatedMusicGear, [FromForm] List<IFormFile> imageFiles, [FromForm] List<string> imagesToDelete)
        {
            if (id != updatedMusicGear.Id)
            {
                return BadRequest("MusicGear ID mismatch.");
            }

            var musicGear = await _context.MusicGear.FindAsync(id);
            if (musicGear == null)
            {
                return NotFound("MusicGear not found.");
            }

            if (!string.IsNullOrEmpty(updatedMusicGear.Brand))
            {
                musicGear.Brand = updatedMusicGear.Brand;
            }

            if (!string.IsNullOrEmpty(updatedMusicGear.Model))
            {
                musicGear.Model = updatedMusicGear.Model;
            }

            if (updatedMusicGear.Year.HasValue)
            {
                musicGear.Year = updatedMusicGear.Year.Value;
            }

            if (!string.IsNullOrEmpty(updatedMusicGear.Description))
            {
                musicGear.Description = updatedMusicGear.Description;
            }

            if (!string.IsNullOrEmpty(updatedMusicGear.Location))
            {
                musicGear.Location = updatedMusicGear.Location;
            }

            if (!string.IsNullOrEmpty(updatedMusicGear.Condition))
            {
                musicGear.Condition = updatedMusicGear.Condition;
            }

            if (updatedMusicGear.Price.HasValue)
            {
                musicGear.Price = updatedMusicGear.Price.Value;
            }

            // Handle image deletion
            if (imagesToDelete != null && imagesToDelete.Any())
            {
                musicGear.ImagePaths = musicGear.ImagePaths.Except(imagesToDelete).ToList();
            }

            // Handle image addition
            if (imageFiles != null && imageFiles.Any())
            {
                var uploadPath = "assets/uploads/musicgear";
                var baseUrl = $"{Request.Scheme}://{Request.Host}/";
                var imageUrls = await ImageUploadHelper.UploadImagesAsync(imageFiles, uploadPath, baseUrl);
                musicGear.ImagePaths.AddRange(imageUrls);
            }

            _context.MusicGear.Update(musicGear);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var musicGear = await _context.MusicGear.FindAsync(id);
            if (musicGear == null)
            {
                return NotFound("MusicGear not found.");
            }

            _context.MusicGear.Remove(musicGear);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        [HttpDelete("{id}/images")]
        public async Task<IActionResult> DeleteImage(int id, [FromBody] string imageUrl)
        {
            var musicGear = await _context.MusicGear.FindAsync(id);
            if (musicGear == null)
            {
                return NotFound("MusicGear not found.");
            }

            if (musicGear.ImagePaths.Contains(imageUrl))
            {
                musicGear.ImagePaths.Remove(imageUrl);
                _context.MusicGear.Update(musicGear);
                await _context.SaveChangesAsync();
                return NoContent();
            }

            return NotFound("Image not found.");
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var musicGear = await _context.MusicGear.FindAsync(id);
            if (musicGear == null)
            {
                return NotFound("MusicGear not found.");
            }

            return Ok(musicGear);
        }

    }
}