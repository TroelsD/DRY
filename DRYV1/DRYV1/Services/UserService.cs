using DRYV1.Controllers;
using DRYV1.Interfaces;
using DRYV1.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using DRYV1.Data;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> GetOrCreateUserAsync(OAuthUserInfo userInfo)
    {
        // Check if user already exists using OAuthId and ProviderId
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.OAuthId == userInfo.OAuthId && u.ProviderId == userInfo.ProviderId);

        if (user == null)
        {
            // Create a new user if not found
            user = new User
            {
                Name = userInfo.Name,
                Email = userInfo.Email,
                OAuthId = userInfo.OAuthId,
                ProviderId = userInfo.ProviderId,
                // Password could be null if coming from OAuth
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        return user;
    }

    public string GenerateAuthToken(User user)
    {
        // Generate a JWT token (or other token) for the authenticated user
        // Example: You can use JWT tokens with claims for user info
        return "generated-jwt-token";
    }
}