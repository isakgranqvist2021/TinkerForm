namespace api.Validators
{
    public class EmailValidator
    {

        public static string? ExtractEmailFromContext(HttpContext httpContext)
        {
            if (httpContext.Items.ContainsKey("Email"))
            {
                return httpContext.Items["Email"]?.ToString();
            }

            return null;
        }
    }
}