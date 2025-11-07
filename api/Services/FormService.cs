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
    }
}