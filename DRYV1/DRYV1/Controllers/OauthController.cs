using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using DRYV1.Interfaces;

namespace DRYV1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OAuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IHttpClientFactory _httpClientFactory;

        public OAuthController(IUserService userService, IHttpClientFactory httpClientFactory)
        {
            _userService = userService;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("callback")]
        public async Task<IActionResult> OAuthCallback([FromBody] OAuthCallbackRequest request)
        {
            // Verify the OAuth token with the provider (Google, GitHub, etc.)
            var userInfo = await VerifyOAuthToken(request.ProviderId, request.Token);

            if (userInfo == null)
            {
                return Unauthorized("Invalid OAuth token");
            }

            // Check if the user exists or create a new one
            var user = await _userService.GetOrCreateUserAsync(userInfo);

            // Generate your own auth token (JWT)
            var authToken = _userService.GenerateAuthToken(user);

            return Ok(new
            {
                userId = user.Id,
                authToken = authToken
            });
        }

        private async Task<OAuthUserInfo> VerifyOAuthToken(string providerId, string token)
        {
            // This will differ based on the provider (Google, GitHub, etc.)
            var client = _httpClientFactory.CreateClient();

            if (providerId == "google")
            {
                var response = await client.GetAsync($"https://oauth2.googleapis.com/tokeninfo?id_token={token}");
                if (response.IsSuccessStatusCode)
                {
                    var userInfo = await response.Content.ReadAsAsync<OAuthUserInfo>();
                    return userInfo;
                }
            }

            // Add logic for other providers (GitHub, Facebook, etc.)

            return null;
        }
    }

    public class OAuthCallbackRequest
    {
        public string ProviderId { get; set; }
        public string Token { get; set; }
    }

    public class OAuthUserInfo
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string ProviderId { get; set; }
        public string OAuthId { get; set; } // The ID provided by the OAuth provider
    }
}