using api.Context;
using api.Models;


namespace api.Services
{
    public class AnswerService(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public async Task SaveAnswers(List<AnswerModel> answers)
        {
            await _context.answer.AddRangeAsync(answers);
            await _context.SaveChangesAsync();
        }
    }
}