using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using api.Dto;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmailSettingsController : ControllerBase
    {
        private readonly ModelService _modelService;
        private readonly ILogger<ResponseController> _logger;

        public EmailSettingsController(ModelService modelServices, ILogger<ResponseController> logger)
        {
            _modelService = modelServices;
            _logger = logger;
        }

        [HttpPost]
        [Authorize]
        public ActionResult UpdateEmailSettings([FromBody] UpdateEmailSettingsDto updateEmailSettingsDto)
        {
            var email = HttpContext.Items["Email"]?.ToString();
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            _modelService.emailSettingsService.UpdateSettings(updateEmailSettingsDto, email);

            return Ok();
        }

        [HttpGet]
        [Authorize]
        public ActionResult GetEmailSettings()
        {
            var email = HttpContext.Items["Email"]?.ToString();
            if (email == null)
            {
                _logger.LogWarning("Unauthorized access attempt.");
                return Unauthorized();
            }

            var settings = _modelService.emailSettingsService.GetSettings(email);

            return Ok(settings);
        }
    }
}


