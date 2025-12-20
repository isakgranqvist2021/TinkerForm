using api.Context;
using api.Dto;
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
                .Where(form => form.email == email.ToString())
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
                    response_count = _context.response.Count(
                        response => response.fk_form_id == form.id && response.completed_at != null
                    ),
                })
                .ToList();
        }

        public List<FormModel> GetActiveFormsByEmail(string email)
        {
            return
                _context.form
                .Where(form => form.email == email.ToString() && form.paused_at != null)
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
                    response_count = _context.response.Count(
                        response => response.fk_form_id == form.id && response.completed_at != null
                    ),
                })
                .ToList();
        }

        public FormModel? GetById(Guid id)
        {
            return
                _context.form
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
                    response_count = _context.response.Count(
                        response => response.fk_form_id == form.id && response.completed_at != null
                    ),
                })
                .FirstOrDefault();
        }

        public FormModel InsertOne(CreateFormDto form, string email)
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

            _context.form.Add(newForm);
            _context.SaveChanges();

            return newForm;
        }

        public void UpdateOne(UpdateFormDto form, Guid id, string email)
        {
            var existingForm = _context.form.FirstOrDefault(f => f.id == id && f.email == email);
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

                _context.SaveChanges();
            }
        }

        public FormStatsDto GetFormStats(Guid formId, string email)
        {
            var form = _context.form.FirstOrDefault(f => f.id == formId && f.email == email);
            if (form == null)
            {
                throw new UnauthorizedAccessException("You do not have permission to view stats for this form.");
            }

            var totalResponses = _context.response.Count(r => r.fk_form_id == formId);
            var completedResponses = _context.response.Count(r => r.fk_form_id == formId && r.completed_at != null);

            return new FormStatsDto
            {
                total_responses = totalResponses,
                completed_responses = completedResponses
            };
        }

        public object GetAnswers(Guid formId)
        {
            var sections = _context.section.Where(s => s.fk_form_id == formId).ToList();
            var answers = _context.answer
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
                .ToList();

            return new
            {
                sections,
                answers
            };
        }

        public FormWithAnswersDto? GetFormWithAnswers(Guid formId, string email)
        {
            var form = _context.form.FirstOrDefault(f => f.id == formId && f.email == email);
            if (form == null)
            {
                return null;
            }

            var responseAnswerData = _context.answer
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
                .ToList();

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

        public int GetResponseCount(Guid formId)
        {
            return _context.response.Where(
                response => response.completed_at != null && response.fk_form_id == formId
            ).Count();
        }

        public DateTime? ToggleIsPaused(Guid formId, string email)
        {
            var form = _context.form.FirstOrDefault(f => f.id == formId && f.email == email);
            if (form == null)
            {
                throw new UnauthorizedAccessException("You do not have permission to modify this form.");
            }

            if (form.paused_at == null)
            {
                form.paused_at = DateTime.UtcNow;
            }
            else
            {
                form.paused_at = null;
            }

            _context.SaveChanges();

            return form.paused_at;
        }
    }
}

