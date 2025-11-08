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
            return _context.response.FirstOrDefault(r => r.id == id);
        }

        public void InsertOne(ResponseModel response)
        {
            _context.response.Add(response);
            _context.SaveChanges();
        }
    }
}

