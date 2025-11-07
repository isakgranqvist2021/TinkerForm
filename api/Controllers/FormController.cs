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
        private readonly ModelService _modelService;

        public FormController(ModelService modelServices)
        {
            _modelService = modelServices;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<List<FormModel>> Get()
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            var forms = _modelService.formService.GetFormsByEmail(email);

            return Ok(forms);
        }


        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<FormModel> GetById(Guid id)
        {
            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            var form = _modelService.formService.GetById(id, email);
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
            _modelService.formService.DeleteForm(id, email);

            return NoContent();
        }


        [HttpGet("{id}/slim")]
        public ActionResult<FormModel> GetSlimById(Guid id)
        {
            var form = _modelService.formService.GetSlimById(id);
            if (form == null)
            {
                return NotFound();
            }

            return Ok(form);
        }
    }
}


