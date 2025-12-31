using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;
using api.Dto;
using api.ModelBinders;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FormController(ModelService modelServices) : ControllerBase
    {
        private readonly ModelService _modelService = modelServices;

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<FormModel>>> Get([FromEmail] string email)
        {
            var forms = await _modelService.formService.GetFormsByEmail(email);

            return Ok(forms);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FormModel>> GetById(Guid id)
        {
            var form = await _modelService.formService.GetById(id);
            if (form == null)
            {
                return NotFound();
            }

            return Ok(form);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> Delete(Guid id, [FromEmail] string email)
        {
            await _modelService.formService.DeleteForm(id, email);

            return NoContent();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<FormModel>> Create(CreateFormDto form, [FromEmail] string email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdForm = await _modelService.formService.InsertOne(form, email);
            return CreatedAtAction(nameof(GetById), new { createdForm.id }, createdForm);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> Update(Guid id, [FromBody] UpdateFormDto form, [FromEmail] string email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _modelService.formService.UpdateOne(form, id, email);
            await _modelService.sectionService.UpsertSections(form.sections, id, email);

            return NoContent();
        }

        [HttpGet("{id}/stats")]
        [Authorize]
        public ActionResult<FormStatsDto> GetFormStats(Guid id, [FromEmail] string email)
        {
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
        public ActionResult ToggleIsPaused(Guid id, [FromEmail] string email)
        {
            var isPaused = _modelService.formService.ToggleIsPaused(id, email);

            return Ok(isPaused);
        }

        [HttpGet("{id}/with-answers")]
        [Authorize]
        public ActionResult<FormWithAnswersDto> GetFormWithAnswers(Guid id, [FromEmail] string email)
        {
            var formWithAnswers = _modelService.formService.GetFormWithAnswers(id, email);
            if (formWithAnswers == null)
            {
                return NotFound();
            }

            return Ok(formWithAnswers);
        }
    }
}

