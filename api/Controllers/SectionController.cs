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

        public SectionController(ModelService modelServices)
        {
            _modelService = modelServices;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (sections == null)
            {
                return BadRequest();
            }

            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            var createdSections = _modelService.sectionService.Create(sections, email);
            return CreatedAtAction(nameof(GetByFormId), new { formId = createdSections.First().fk_form_id }, createdSections);
        }
    }
}


