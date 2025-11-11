namespace api.Middleware
{
    public class Auth0UserInfoMiddleware(RequestDelegate next)
    {
        private readonly RequestDelegate _next = next;
        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity?.IsAuthenticated != false)
            {
                var emailClaim = context.User.Claims.FirstOrDefault(c =>
                    c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                );

                context.Items["Email"] = emailClaim?.Value;
            }

            await _next(context);
        }
    }
}
