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
        public ActionResult<FormModel> GetById(Guid id)
        {
            var form = _modelService.formService.GetById(id);
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

        [HttpPost]
        [Authorize]
        public ActionResult<FormModel> Create(CreateFormModel form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            var createdForm = _modelService.formService.InsertOne(form, email);
            return CreatedAtAction(nameof(GetById), new { id = createdForm.id }, createdForm);
        }

        [HttpPut("{id}")]
        [Authorize]
        public ActionResult Update(Guid id, [FromBody] UpdateFormModel form)
        {
            Console.WriteLine("Updating form with ID: " + id);
            Console.WriteLine(ModelState.IsValid);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var email = EmailValidator.ExtractEmailFromContext(HttpContext);
            _modelService.formService.UpdateOne(form, id, email);

            return NoContent();
        }
    }
}


