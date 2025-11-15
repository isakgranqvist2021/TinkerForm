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
                    cover_image = f.cover_image,
                    theme = f.theme,
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
                    cover_image = f.cover_image,
                    theme = f.theme,
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
                cover_image = form.cover_image,
                theme = form.theme,
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
                existingForm.cover_image = form.cover_image;
                existingForm.updated_at = DateTime.UtcNow;
                existingForm.theme = form.theme;

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

        public FormWithAnswersModel? GetFormWithAnswers(Guid formId, string email)
        {
            var form = _context.form.FirstOrDefault(f => f.id == formId && f.email == email);
            if (form == null)
            {
                return null;
            }

            // Fetch all responses and answers in one query
            var responseAnswerData = _context.answer
                .Where(a => a.fk_form_id == formId)
                .Join(
                    _context.section,
                    a => a.fk_section_id,
                    q => q.id,
                    (a, q) => new { answer = a, question = q.title }
                )
                .GroupBy(x => x.answer.fk_response_id)
                .ToList();

            var responses = new List<ResponseWithAnswersModel>();

            foreach (var groupedAnswers in responseAnswerData)
            {
                var responseAnswers = groupedAnswers
                    .Select(x => new QuestionAnswerModel
                    {
                        question = x.question,
                        answer = x.answer.answer_text ?? x.answer.answer_number?.ToString() ?? x.answer.answer_boolean?.ToString() ?? x.answer.answer_file ?? string.Empty
                    })
                    .ToList();

                responses.Add(new ResponseWithAnswersModel
                {
                    response_id = groupedAnswers.Key,
                    answers = responseAnswers
                });
            }

            var formWithAnswers = new FormWithAnswersModel
            {
                id = form.id,
                title = form.title,
                location = form.location,
                description = form.description,
                responses = responses
            };

            return formWithAnswers;
        }
    }
}

