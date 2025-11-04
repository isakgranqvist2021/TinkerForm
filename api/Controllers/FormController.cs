using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;
using api.Validators;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FormController : ControllerBase
    {
        private readonly FormService _formService;

        public FormController(FormService formService)
        {
            _formService = formService;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<List<FormModel>> Get()
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            var forms = _formService.GetFormsByEmail(email);

            return Ok(forms);
        }


        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<FormModel> GetById(Guid id)
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            var form = _formService.GetById(id, email);
            if (form == null)
            {
                return NotFound();
            }

            return Ok(form);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult Delete(Guid id)
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            _formService.DeleteForm(id, email);

            return NoContent();
        }
    }
}


