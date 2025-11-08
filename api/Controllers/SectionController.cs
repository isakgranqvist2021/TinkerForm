using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SectionController : ControllerBase
    {
        private readonly ModelService _modelService;

        public SectionController(ModelService modelServices)
        {
            _modelService = modelServices;
        }

        [HttpGet("form/{formId}")]
        public ActionResult<IEnumerable<SectionModel>> GetByFormId(Guid formId)
        {
            var sections = _modelService.sectionService.GetByFormId(formId);
            if (sections == null)
            {
                return NotFound();
            }

            return Ok(sections);
        }
    }
}


