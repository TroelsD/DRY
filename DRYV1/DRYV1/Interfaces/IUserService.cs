using DRYV1.Controllers;
using DRYV1.Models;

namespace DRYV1.Interfaces;

public interface IUserService
{
    Task<User> GetOrCreateUserAsync(OAuthUserInfo userInfo);
    string GenerateAuthToken(User user);
}