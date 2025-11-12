using api.Context;
using api.Models;

namespace api.Services
{
    public class FormService
    {
        private readonly AppDbContext _context;

        public FormService(AppDbContext context)
        {
            _context = context;
        }

        public void DeleteForm(Guid id, string email)
        {
            var form = _context.form.FirstOrDefault(f => f.id == id && f.email == email.ToString());
            if (form != null)
            {
                _context.form.Remove(form);
                _context.SaveChanges();
            }
        }

        public List<FormModel> GetFormsByEmail(string email)
        {
            return
                _context.form
                .Where(f => f.email == email.ToString())
                .Select(f => new FormModel
                {
                    id = f.id,
                    email = f.email,
                    title = f.title,
                    description = f.description,
                    location = f.location,
                    created_at = f.created_at,
                    updated_at = f.updated_at,
                    response_count = _context.response.Count(r => r.fk_form_id == f.id && r.completed_at != null),
                })
                .ToList();
        }

        public FormModel? GetById(Guid id)
        {
            return
                _context.form
                .Where(f => f.id == id)
                .Select(f => new FormModel
                {
                    id = f.id,
                    email = f.email,
                    title = f.title,
                    description = f.description,
                    location = f.location,
                    created_at = f.created_at,
                    updated_at = f.updated_at,
                    response_count = _context.response.Count(r => r.fk_form_id == f.id && r.completed_at != null),
                })
                .FirstOrDefault();
        }

        public FormModel InsertOne(CreateFormModel form, string email)
        {
            var newForm = new FormModel
            {
                email = email,
                title = form.title,
                description = form.description,
                location = form.location,
            };

            _context.form.Add(newForm);
            _context.SaveChanges();
            return newForm;
        }

        public void UpdateOne(UpdateFormModel form, Guid id, string email)
        {
            var existingForm = _context.form.FirstOrDefault(f => f.id == id && f.email == email);
            if (existingForm != null)
            {
                existingForm.title = form.title;
                existingForm.description = form.description;
                existingForm.location = form.location;
                existingForm.updated_at = DateTime.UtcNow;

                _context.SaveChanges();
            }
        }

        public FormStats GetFormStats(Guid formId, string email)
        {
            var form = _context.form.FirstOrDefault(f => f.id == formId && f.email == email);
            if (form == null)
            {
                throw new UnauthorizedAccessException("You do not have permission to view stats for this form.");
            }

            var totalResponses = _context.response.Count(r => r.fk_form_id == formId);
            var completedResponses = _context.response.Count(r => r.fk_form_id == formId && r.completed_at != null);

            return new FormStats
            {
                total_responses = totalResponses,
                completed_responses = completedResponses
            };
        }

        public IEnumerable<object> GetAnswers(Guid formId)
        {
            var sections = _context.section.Where(s => s.fk_form_id == formId).ToList();
            var responses = _context.response.Where(r => r.fk_form_id == formId && r.completed_at != null).ToList();
            var answers = _context.answer.Where(a => responses.Select(r => r.id).Contains(a.fk_response_id)).ToList();

            var result = new List<object>();

            foreach (var section in sections)
            {
                var sectionAnswers = answers.Where(a => a.fk_section_id == section.id).ToList();
                result.Add(new
                {
                    section,
                    answers = sectionAnswers
                });
            }

            return result;
        }
    }
}
