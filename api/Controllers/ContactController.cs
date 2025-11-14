using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly ModelService _modelService;

        public ContactController(ModelService modelServices)
        {
            _modelService = modelServices;
        }

        [HttpPost]
        public ActionResult GetAnswersByResponseId([FromBody] ContactModel contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _modelService.contactService.AddContact(contact);
            return Created();
        }
    }
}


