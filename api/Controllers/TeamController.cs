using Microsoft.AspNetCore.Mvc;
using api.Services;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TeamController : ControllerBase
    {
        private readonly ModelService _modelService;
        private readonly ILogger<SubscriptionController> _logger;

        public TeamController(ModelService modelServices, ILogger<SubscriptionController> logger)
        {
            _modelService = modelServices;
            _logger = logger;
        }

        [HttpPost]
        [Authorize]
        public ActionResult CreateTeam()
        {
            var email = HttpContext.Items["Email"]?.ToString();
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            var ok = _modelService.teamService.CreateTeam(email);
            if (ok)
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}


