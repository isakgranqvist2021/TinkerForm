using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using api.ModelBinders;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SubscriptionController(ModelService modelServices) : ControllerBase
    {
        private readonly ModelService _modelService = modelServices;

        [HttpPost]
        public ActionResult Create([FromBody] SubscriptionModel subscription)
        {
            _modelService.subscriptionService.Create(subscription);
            return Created();
        }

        [HttpGet]
        [Authorize]
        public ActionResult GetByEmail([FromEmail] string email)
        {
            var subscription = _modelService.subscriptionService.GetByEmail(email);
            if (subscription == null)
            {
                return NotFound();
            }

            return Ok(subscription);
        }

        [HttpDelete]
        [Authorize]
        public ActionResult Delete([FromEmail] string email)
        {
            var success = _modelService.subscriptionService.Delete(email);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}


