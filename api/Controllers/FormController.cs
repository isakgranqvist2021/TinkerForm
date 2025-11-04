using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Context;
using api.Models;

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
        public ActionResult<List<FormModel>> Get()
        {
            var email = HttpContext.Items["Email"];
            if (email == null)
            {
                return Unauthorized();
            }

            var forms = _context.form
                .Where(f => f.email == email.ToString())
                .Select(f => new FormModel
                {
                    id = f.id,
                    email = f.email,
                    title = f.title,
                    description = f.description,
                    location = f.location,
                    created_at = f.created_at,
                    updated_at = f.updated_at,
                    response_count = _context.response.Count(r => r.fk_form_id == f.id && r.completed_at != null),
                })
                .ToList();

            return Ok(forms);
        }

    }
}

