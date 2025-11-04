using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Context;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FormController : ControllerBase
    {
        private readonly ILogger<FormController> _logger;
        private readonly AppDbContext _context;

        public FormController(ILogger<FormController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public IActionResult Get()
        {

            var email = HttpContext.Items["Email"];
            if (email == null)
            {
                return Unauthorized();
            }

            return Ok(new
            {
                Message = "Hello, your email is " + email
            });
        }
    }
}

