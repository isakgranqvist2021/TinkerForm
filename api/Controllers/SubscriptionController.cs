using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using api.Validators;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SubscriptionController : ControllerBase
    {
        private readonly ModelService _modelService;

        public SubscriptionController(ModelService modelServices)
        {
            _modelService = modelServices;
        }

        [HttpPost]
        public ActionResult Create([FromBody] SubscriptionModel subscription)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _modelService.subscriptionService.Create(subscription);
            return Created();
        }

        [HttpGet]
        [Authorize]
        public ActionResult GetByEmail()
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            var subscription = _modelService.subscriptionService.GetByEmail(email);
            if (subscription == null)
            {
                return NotFound();
            }

            return Ok(subscription);
        }

        [HttpDelete]
        [Authorize]
        public ActionResult Delete()
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            var success = _modelService.subscriptionService.Delete(email);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}


