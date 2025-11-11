using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using api.Validators;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SectionController : ControllerBase
    {
        private readonly ModelService _modelService;
        private readonly ILogger<SectionController> _logger;

        public SectionController(ModelService modelServices, ILogger<SectionController> logger)
        {
            _modelService = modelServices;
            _logger = logger;
        }

        [HttpGet("form/{formId}")]
        public ActionResult<IEnumerable<SectionModel>> GetByFormId(Guid formId)
        {
            var sections = _modelService.sectionService.GetByFormId(formId);
            if (sections == null)
            {
                return NotFound();
            }

            return Ok(sections);
        }

        [HttpPost]
        [Authorize]
        public ActionResult Create([FromBody] List<SectionModel> sections)
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (sections == null)
            {
                return BadRequest();
            }

            var createdSections = _modelService.sectionService.Create(sections, email);
            return CreatedAtAction(nameof(GetByFormId), new { formId = createdSections.First().fk_form_id }, createdSections);
        }
    }
}


