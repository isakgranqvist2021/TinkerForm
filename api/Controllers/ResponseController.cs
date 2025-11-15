using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;
using api.Validators;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ResponseController : ControllerBase
    {
        private readonly ModelService _modelService;
        private readonly ILogger<ResponseController> _logger;

        public ResponseController(ModelService modelServices, ILogger<ResponseController> logger)
        {
            _modelService = modelServices;
            _logger = logger;
        }

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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _modelService.responseService.InsertOne(response);
            return CreatedAtAction(nameof(GetById), new { id = response.id }, response);
        }

        [HttpGet("form/{formId}")]
        [Authorize]
        public ActionResult<IEnumerable<ResponseModel>> ListByFormId(Guid formId)
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

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
        public ActionResult UpdateScoreAndReasoning([FromBody] List<UpdateScoreAndReasoningModel> updateModels)
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

            _modelService.responseService.UpdateScoreAndReasoning(updateModels, email);
            return NoContent();
        }
    }
}


