using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StatsController : ControllerBase
    {
        private readonly ModelService _modelService;
        private readonly ILogger<StatsController> _logger;

        public StatsController(ModelService modelService, ILogger<StatsController> logger)
        {
            _modelService = modelService;
            _logger = logger;
        }

        [HttpGet("forms")]
        [Authorize]
        public ActionResult<StatsDto> GetStats()
        {
            var email = HttpContext.Items["Email"]?.ToString();
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            var dto = _modelService.statsService.GetFormStats(email);

            return Ok(dto);
        }
    }
}