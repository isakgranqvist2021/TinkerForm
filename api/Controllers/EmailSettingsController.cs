using Microsoft.AspNetCore.Mvc;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using api.Dto;
using api.ModelBinders;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmailSettingsController(ModelService modelServices) : ControllerBase
    {
        private readonly ModelService _modelService = modelServices;

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> UpdateEmailSettings([FromBody] UpdateEmailSettingsDto updateEmailSettingsDto, [FromEmail] string email)
        {
            await _modelService.emailSettingsService.UpdateSettings(updateEmailSettingsDto, email);

            return Ok();
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> GetEmailSettings([FromEmail] string email)
        {
            var settings = await _modelService.emailSettingsService.GetSettings(email);

            return Ok(settings);
        }
    }
}


