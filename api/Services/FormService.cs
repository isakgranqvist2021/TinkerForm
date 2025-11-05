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

        public FormModel? GetById(Guid id, string email)
        {
            return
                _context.form
                .Where(f => f.id == id && f.email == email.ToString())
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
    }
}