using api.Context;
using api.Models;

namespace api.Services
{
    public class ResponseService
    {
        private readonly AppDbContext _context;

        public ResponseService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<object> GetAnswers(Guid id)
        {
            return _context.answer
                .Join(_context.section, a => a.fk_section_id, s => s.id, (answer, section) => new
                {
                    answer,
                    section
                })
                .Where(obj => obj.answer.fk_response_id == id);
        }

        public ResponseModel GetById(Guid id)
        {
            var response = _context.response.FirstOrDefault(r => r.id == id);
            if (response == null)
            {
                throw new KeyNotFoundException($"Response with ID {id} not found.");
            }

            return response;
        }

        public void InsertOne(ResponseModel response)
        {
            _context.response.Add(response);
            _context.SaveChanges();
        }

        public IEnumerable<ResponseModel> ListByFormId(Guid formId, string email)
        {
            var form = _context.form.FirstOrDefault(f => f.id == formId && f.email == email);
            if (form == null)
            {
                return Enumerable.Empty<ResponseModel>();
            }

            return _context.response.Where(r => r.fk_form_id == formId).ToList();
        }

        public void UpdateCompletedAt(Guid responseId)
        {
            var response = _context.response.FirstOrDefault(r => r.id == responseId);
            if (response != null)
            {
                response.completed_at = DateTime.UtcNow;
                _context.SaveChanges();
            }
        }
    }
}