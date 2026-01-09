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
    public class ResponseController(ModelService modelServices) : ControllerBase
    {
        private readonly ModelService _modelService = modelServices;

        [HttpGet("{id}/answers")]
        [Authorize]
        public ActionResult GetAnswersByResponseId(Guid id)
        {
            var answers = _modelService.responseService.GetAnswers(id);
            if (answers == null)
            {
                return NotFound();
            }

            return Ok(answers);
        }

        [HttpGet("{id}")]
        public ActionResult<ResponseModel> GetById(Guid id)
        {
            var response = _modelService.responseService.GetById(id);
            if (response == null)
            {
                return NotFound();
            }

            return Ok(response);
        }

        [HttpPost]
        public ActionResult CreateResponse([FromBody] ResponseModel response)
        {
            _modelService.responseService.InsertOne(response);
            return CreatedAtAction(nameof(GetById), new { id = response.id }, response);
        }

        [HttpGet("form/{formId}")]
        [Authorize]
        public ActionResult<IEnumerable<ResponseModel>> ListByFormId(Guid formId, [FromEmail] string email)
        {
            var responses = _modelService.responseService.ListByFormId(formId, email);
            if (responses == null)
            {
                return NotFound();
            }

            return Ok(responses);
        }

        [HttpPut("{responseId}/complete")]
        public ActionResult MarkAsCompleted(Guid responseId)
        {
            _modelService.responseService.UpdateCompletedAt(responseId);
            return NoContent();
        }

        [HttpPut("score")]
        [Authorize]
        public ActionResult UpdateScoreAndReasoning([FromBody] List<UpdateScoreAndReasoningDto> updateModels, [FromEmail] string email)
        {
            _modelService.responseService.UpdateScoreAndReasoning(updateModels, email);
            return NoContent();
        }
    }
}


