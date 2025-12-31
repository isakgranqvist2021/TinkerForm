using System.Threading.Tasks;
using api.Context;
using api.Dto;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class FormService(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public async Task DeleteForm(Guid id, string email)
        {
            var form = await _context.form.FirstOrDefaultAsync(f => f.id == id && f.email == email);
            if (form != null)
            {
                _context.form.Remove(form);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<FormModel>> GetFormsByEmail(string email)
        {
            return
                await _context.form
                .Where(form => form.email == email)
                .Select(form => new FormModel
                {
                    id = form.id,
                    email = form.email,
                    title = form.title,
                    description = form.description,
                    location = form.location,
                    created_at = form.created_at,
                    updated_at = form.updated_at,
                    paused_at = form.paused_at,
                    cover_image = form.cover_image,
                    availability = form.availability,
                    start_date = form.start_date,
                    end_date = form.end_date,
                    max_responses = form.max_responses,
                    theme = form.theme,
                    total_responses = _context.response.Count(
                        response => response.fk_form_id == form.id
                    ),
                    completed_responses = _context.response.Count(
                        response => response.fk_form_id == form.id && response.completed_at != null
                    ),
                })
                .ToListAsync();
        }

        public List<FormModel> GetActiveFormsByEmail(string email)
        {
            return
                _context.form
                .Where(form => form.email == email && form.paused_at == null)
                .Select(form => new FormModel
                {
                    id = form.id,
                    email = form.email,
                    title = form.title,
                    description = form.description,
                    location = form.location,
                    created_at = form.created_at,
                    updated_at = form.updated_at,
                    cover_image = form.cover_image,
                    theme = form.theme,
                    paused_at = form.paused_at,
                    availability = form.availability,
                    start_date = form.start_date,
                    end_date = form.end_date,
                    max_responses = form.max_responses,
                    completed_responses = _context.response.Count(
                        response => response.fk_form_id == form.id && response.completed_at != null
                    ),
                })
                .ToList();
        }

        public async Task<FormModel?> GetById(Guid id)
        {
            return
                await _context.form
                .Where(form => form.id == id)
                .Select(form => new FormModel
                {
                    id = form.id,
                    email = form.email,
                    title = form.title,
                    description = form.description,
                    location = form.location,
                    created_at = form.created_at,
                    updated_at = form.updated_at,
                    cover_image = form.cover_image,
                    theme = form.theme,
                    paused_at = form.paused_at,
                    availability = form.availability,
                    start_date = form.start_date,
                    end_date = form.end_date,
                    max_responses = form.max_responses,
                    completed_responses = _context.response.Count(
                        response => response.fk_form_id == form.id && response.completed_at != null
                    ),
                })
                .FirstOrDefaultAsync();
        }

        public async Task<FormModel> InsertOne(CreateFormDto form, string email)
        {
            var newForm = new FormModel
            {
                email = email,
                title = form.title,
                description = form.description,
                location = form.location,
                cover_image = form.cover_image,
                theme = form.theme,
                paused_at = null,
                availability = form.availability,
                max_responses = form.max_responses,
                start_date = form.start_date.ToUniversalTime(),
                end_date = form.end_date.ToUniversalTime(),
            };

            await _context.form.AddAsync(newForm);
            await _context.SaveChangesAsync();

            return newForm;
        }

        public async Task UpdateOne(UpdateFormDto form, Guid id, string email)
        {
            var existingForm = await _context.form.FirstOrDefaultAsync(f => f.id == id && f.email == email);
            if (existingForm != null)
            {
                existingForm.title = form.title;
                existingForm.description = form.description;
                existingForm.location = form.location;
                existingForm.cover_image = form.cover_image;
                existingForm.updated_at = DateTime.UtcNow;
                existingForm.theme = form.theme;
                existingForm.availability = form.availability;
                existingForm.max_responses = form.max_responses;
                existingForm.start_date = form.start_date.ToUniversalTime();
                existingForm.end_date = form.end_date.ToUniversalTime();

                await _context.SaveChangesAsync();
            }
        }

        public async Task<FormStatsDto> GetFormStats(Guid formId, string email)
        {
            var form = await _context.form.FirstOrDefaultAsync(f => f.id == formId && f.email == email) ?? throw new UnauthorizedAccessException("You do not have permission to view stats for this form.");
            var totalResponses = await _context.response.CountAsync(r => r.fk_form_id == formId);
            var completedResponses = await _context.response.CountAsync(r => r.fk_form_id == formId && r.completed_at != null);

            return new FormStatsDto
            {
                total_responses = totalResponses,
                completed_responses = completedResponses
            };
        }

        public async Task<object> GetAnswers(Guid formId)
        {
            var sections = await _context.section.Where(s => s.fk_form_id == formId).ToListAsync();
            var answers = await _context.answer
                .Where(a => a.fk_form_id == formId)
                .Select(a => new
                {
                    a.id,
                    fkResponseId = a.fk_response_id,
                    fkSectionId = a.fk_section_id,
                    answerText = a.answer_text,
                    answerNumber = a.answer_number,
                    answerBoolean = a.answer_boolean,
                    answerFile = a.answer_file,
                    createdAt = a.created_at,
                    updatedAt = a.updated_at
                })
                .ToListAsync();

            return new
            {
                sections,
                answers
            };
        }

        public async Task<FormWithAnswersDto?> GetFormWithAnswers(Guid formId, string email)
        {
            var form = await _context.form.FirstOrDefaultAsync(f => f.id == formId && f.email == email);
            if (form == null)
            {
                return null;
            }

            var responseAnswerData = await _context.answer
                .Where(answer => answer.fk_form_id == formId)
                .Join(
                    _context.response.Where(r => r.fk_form_id == formId && r.score == null),
                    answer => answer.fk_response_id,
                    response => response.id,
                    (answer, response) => new { answer, response }
                )
                .Join(
                    _context.section,
                    ar => ar.answer.fk_section_id,
                    section => section.id,
                    (ar, section) => new
                    {
                        ar.response,
                        ar.answer,
                        ar.answer.metadata,
                        question = section.title
                    }
                )
                .GroupBy(x => x.response.id)
                .ToListAsync();

            var responses = new List<ResponseWithAnswersDto>();

            foreach (var groupedAnswers in responseAnswerData)
            {
                var responseAnswers = groupedAnswers
                    .Select(x => new QuestionAnswerDto
                    {
                        metadata = x.metadata,
                        question = x.question,
                        answer = x.answer.answer_text ?? x.answer.answer_number?.ToString() ?? x.answer.answer_boolean?.ToString() ?? x.answer.answer_file ?? string.Empty
                    })
                    .ToList();

                responses.Add(new ResponseWithAnswersDto
                {
                    response_id = groupedAnswers.Key,
                    answers = responseAnswers
                });
            }

            var formWithAnswers = new FormWithAnswersDto
            {
                id = form.id,
                title = form.title,
                location = form.location,
                description = form.description,
                responses = responses
            };

            return formWithAnswers;
        }

        public async Task<int> GetResponseCount(Guid formId)
        {
            return await _context.response.Where(
                response => response.completed_at != null && response.fk_form_id == formId
            ).CountAsync();
        }

        public async Task<DateTime?> ToggleIsPaused(Guid formId, string email)
        {
            var form = await _context.form.FirstOrDefaultAsync(f => f.id == formId && f.email == email) ?? throw new UnauthorizedAccessException("You do not have permission to modify this form.");
            form.updated_at = DateTime.UtcNow;

            if (form.paused_at == null)
            {
                form.paused_at = DateTime.UtcNow;
            }
            else
            {
                form.paused_at = null;
            }

            await _context.SaveChangesAsync();

            return form.paused_at;
        }
    }
}

