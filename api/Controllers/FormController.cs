using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;
using api.Validators;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FormController : ControllerBase
    {
        private readonly ModelService _modelService;
        private readonly ILogger<FormController> _logger;

        public FormController(ModelService modelServices, ILogger<FormController> logger)
        {
            _modelService = modelServices;
            _logger = logger;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<List<FormModel>> Get()
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            var forms = _modelService.formService.GetFormsByEmail(email);
            return Ok(forms);
        }


        [HttpGet("{id}")]
        public ActionResult<FormModel> GetById(Guid id)
        {
            var form = _modelService.formService.GetById(id);
            if (form == null)
            {
                return NotFound();
            }

            return Ok(form);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult Delete(Guid id)
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            _modelService.formService.DeleteForm(id, email);

            return NoContent();
        }

        [HttpPost]
        [Authorize]
        public ActionResult<FormModel> Create(CreateFormModel form)
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

            var createdForm = _modelService.formService.InsertOne(form, email);
            return CreatedAtAction(nameof(GetById), new { id = createdForm.id }, createdForm);
        }

        [HttpPut("{id}")]
        [Authorize]
        public ActionResult Update(Guid id, [FromBody] UpdateFormModel form)
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

            _modelService.formService.UpdateOne(form, id, email);
            _modelService.sectionService.UpsertSections(form.sections, id, email);

            return NoContent();
        }

        [HttpGet("{id}/stats")]
        [Authorize]
        public ActionResult<FormStats> GetFormStats(Guid id)
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            var stats = _modelService.formService.GetFormStats(id, email);
            return Ok(stats);
        }
    }
}

