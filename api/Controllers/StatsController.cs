using api.Dto;
using api.ModelBinders;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StatsController(ModelService modelService) : ControllerBase
    {
        private readonly ModelService _modelService = modelService;

        [HttpGet("forms")]
        [Authorize]
        public ActionResult<StatsDto> GetStats([FromEmail] string email)
        {
            var dto = _modelService.statsService.GetFormStats(email);
            return Ok(dto);
        }
    }
}