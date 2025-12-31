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
        public ActionResult CreateAnswers([FromBody] List<AnswerModel> answers)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _modelService.answerService.SaveAnswers(answers);
            return Created();
        }
    }
}


