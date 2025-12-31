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
        public ActionResult UpdateEmailSettings([FromBody] UpdateEmailSettingsDto updateEmailSettingsDto, [FromEmail] string email)
        {
            _modelService.emailSettingsService.UpdateSettings(updateEmailSettingsDto, email);

            return Ok();
        }

        [HttpGet]
        [Authorize]
        public ActionResult GetEmailSettings([FromEmail] string email)
        {
            var settings = _modelService.emailSettingsService.GetSettings(email);

            return Ok(settings);
        }
    }
}


