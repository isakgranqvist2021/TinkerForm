using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AnswerController(ModelService modelServices) : ControllerBase
    {
        private readonly ModelService _modelService = modelServices;

        [HttpPost]
        public async Task<ActionResult> CreateAnswers([FromBody] List<AnswerModel> answers)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _modelService.answerService.SaveAnswers(answers);

            return Created();
        }
    }
}


