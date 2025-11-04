namespace api.Validators
{
    public class EmailValidator
    {

        public static string ExtractEmailFromContext(HttpContext httpContext)
        {
            if (httpContext.Items.ContainsKey("Email"))
            {
                return httpContext.Items["Email"]?.ToString() ?? throw new Exception("Email not found in HttpContext");
            }

            throw new Exception("Email not found in HttpContext");
        }
    }
}