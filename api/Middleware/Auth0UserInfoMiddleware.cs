using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;

namespace api.Middleware
{
    public class Auth0UserInfoMiddleware(RequestDelegate next, IConfiguration config)
    {
        private readonly RequestDelegate _next = next;
        private readonly string _auth0Domain = config["Auth0:Domain"];

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity?.IsAuthenticated != false)
            {
                var authHeader = context.Request.Headers["Authorization"].ToString();
                if (authHeader.StartsWith("Bearer "))
                {
                    var accessToken = authHeader.Substring("Bearer ".Length);
                    using (var httpClient = new HttpClient())
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                        var response = await httpClient.GetAsync($"https://{_auth0Domain}/userinfo");
                        if (response.IsSuccessStatusCode)
                        {
                            var content = await response.Content.ReadAsStringAsync();
                            var userInfo = JObject.Parse(content);

                            context.Items["Email"] = userInfo["email"]?.ToString();
                        }
                    }
                }
            }

            await _next(context);
        }
    }
}
