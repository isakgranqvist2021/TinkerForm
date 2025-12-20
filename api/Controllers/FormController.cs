using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;
using api.Dto;

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
            var email = HttpContext.Items["Email"]?.ToString();
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
            var email = HttpContext.Items["Email"]?.ToString();
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
        public ActionResult<FormModel> Create(CreateFormDto form)
        {
            var email = HttpContext.Items["Email"]?.ToString();
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
        public ActionResult Update(Guid id, [FromBody] UpdateFormDto form)
        {
            var email = HttpContext.Items["Email"]?.ToString();
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
        public ActionResult<FormStatsDto> GetFormStats(Guid id)
        {
            var email = HttpContext.Items["Email"]?.ToString();
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            var stats = _modelService.formService.GetFormStats(id, email);
            return Ok(stats);
        }

        [HttpGet("{id}/response-count")]
        public ActionResult<int> GetResponseCount(Guid id)
        {
            var response_count = _modelService.formService.GetResponseCount(id);
            return Ok(response_count);
        }

        [HttpGet("{id}/answers")]
        [Authorize]
        public ActionResult GetAnswersByFormId(Guid id)
        {
            var answers = _modelService.formService.GetAnswers(id);
            if (answers == null)
            {
                return NotFound();
            }

            return Ok(answers);
        }

        [HttpPatch("{id}/pause")]
        [Authorize]
        public ActionResult ToggleIsPaused(Guid id)
        {
            var email = HttpContext.Items["Email"]?.ToString();
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            var isPaused = _modelService.formService.ToggleIsPaused(id, email);

            return Ok(isPaused);
        }

        [HttpGet("{id}/with-answers")]
        [Authorize]
        public ActionResult<FormWithAnswersDto> GetFormWithAnswers(Guid id)
        {
            var email = HttpContext.Items["Email"]?.ToString();
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            var formWithAnswers = _modelService.formService.GetFormWithAnswers(id, email);
            if (formWithAnswers == null)
            {
                return NotFound();
            }

            return Ok(formWithAnswers);
        }
    }
}

