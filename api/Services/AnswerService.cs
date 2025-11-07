using api.Context;
using api.Models;

namespace api.Services
{
    public class AnswerService
    {
        private readonly AppDbContext _context;

        public AnswerService(AppDbContext context)
        {
            _context = context;
        }

        public void SaveAnswers(List<AnswerModel> answers)
        {
            _context.answer.AddRange(answers);
            _context.SaveChanges();
        }
    }
}