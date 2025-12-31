using Microsoft.AspNetCore.Mvc;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using api.Models;
using api.Dto;
using api.ModelBinders;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TeamController(ModelService modelServices) : ControllerBase
    {
        private readonly ModelService _modelService = modelServices;

        [HttpPost]
        [Authorize]
        public ActionResult CreateTeam([FromEmail] string email)
        {
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
        public ActionResult<TeamModel> GetTeam([FromEmail] string email)
        {
            var team = _modelService.teamService.GetByEmail(email);
            if (team == null)
            {
                return BadRequest();
            }

            return Ok(team);
        }

        [HttpPatch("logo")]
        [Authorize]
        public ActionResult<TeamModel> UpdateLogo([FromBody] UpdateUrlDto updateUrlDto, [FromEmail] string email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var team = _modelService.teamService.UpdateLogo(updateUrlDto, email);
            if (team == null)
            {
                return BadRequest();
            }

            return Ok(team);
        }

        [HttpPatch("cover-image")]
        [Authorize]
        public ActionResult<TeamModel> UpdateCoverImage([FromBody] UpdateUrlDto updateUrlDto, [FromEmail] string email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var team = _modelService.teamService.UpdateCoverImage(updateUrlDto, email);
            if (team == null)
            {
                return BadRequest();
            }

            return Ok(team);
        }
    }
}


