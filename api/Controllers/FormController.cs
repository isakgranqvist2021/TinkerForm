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
            var forms = _context.form.ToList();
            var sections = _context.section.ToList();
            var responses = _context.response.ToList();
            var answers = _context.answer.ToList();

            // Try to get user info from middleware
            // var email = HttpContext.Items["Email"];
            // if (email == null)
            // {
            //     return Unauthorized();
            // }

            return Ok(new
            {
                Forms = forms,
                Sections = sections,
                Responses = responses,
                Answers = answers
            });
        }
    }
}

