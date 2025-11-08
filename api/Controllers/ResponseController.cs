using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ResponseController : ControllerBase
    {
        private readonly ModelService _modelService;

        public ResponseController(ModelService modelServices)
        {
            _modelService = modelServices;
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
    }
}


