using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FormController : ControllerBase
    {
        private readonly ILogger<FormController> _logger;

        public FormController(ILogger<FormController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Authorize]
        public IActionResult Get()
        {
            // Try to get user info from middleware
            var email = HttpContext.Items["Email"];
            if (email == null)
            {
                return Unauthorized();
            }

            return Ok(new
            {
                email
            });
        }
    }
}

