using Microsoft.AspNetCore.Mvc;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TeamController : ControllerBase
    {
        private readonly ModelService _modelService;
        private readonly ILogger<TeamController> _logger;

        public TeamController(ModelService modelServices, ILogger<TeamController> logger)
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

        [HttpGet("{id}/forms")]
        public ActionResult<List<FormModel>> GetByTeamId(Guid id)
        {
            var team = _modelService.teamService.GetById(id);
            if (team == null)
            {
                return BadRequest();
            }

            var forms = _modelService.formService.GetActiveFormsByEmail(team.email);

            return Ok(forms);
        }

        [HttpGet("{id}")]
        public ActionResult<TeamModel> GetTeamById(Guid id)
        {
            var team = _modelService.teamService.GetById(id);
            if (team == null)
            {
                return BadRequest();
            }

            return Ok(team);
        }

        [HttpGet]
        [Authorize]
        public ActionResult<TeamModel> GetTeam()
        {
            var email = HttpContext.Items["Email"]?.ToString();
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            var team = _modelService.teamService.GetByEmail(email);
            if (team == null)
            {
                return BadRequest();
            }

            return Ok(team);
        }
    }
}


