// function listByFormId(formId: string) {
//   return db
//     .select()
//     .from(sectionTable)
//     .where(eq(sectionTable.fk_form_id, formId));
// }

using api.Context;
using api.Models;

namespace api.Services
{
    public class SectionService
    {
        private readonly AppDbContext _context;

        public SectionService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<SectionModel> GetByFormId(Guid formId)
        {
            return _context.section
                .Where(s => s.fk_form_id == formId)
                .ToList();
        }

        public IEnumerable<SectionModel> Create(IEnumerable<SectionModel> sections, string email)
        {
            var createdSections = new List<SectionModel>();

            var formIds = sections.Select(s => s.fk_form_id).Distinct().ToList();
            var forms = _context.form
               .Where(f => formIds.Contains(f.id) && f.email == email)
               .ToDictionary(f => f.id);

            foreach (var section in sections)
            {
                if (!forms.ContainsKey(section.fk_form_id))
                {
                    throw new UnauthorizedAccessException("You do not have permission to add sections to this form.");
                }

                _context.section.Add(section);
                createdSections.Add(section);
            }


            _context.SaveChanges();

            return createdSections;
        }

        public void UpsertSections(IEnumerable<SectionModel> sections, Guid formId, string email)
        {
            var form = _context.form.FirstOrDefault(f => f.id == formId && f.email == email) ?? throw new UnauthorizedAccessException("You do not have permission to modify sections for this form.");
            var existingSections = _context.section
                .Where(s => s.fk_form_id == formId)
                .ToList();

            var sectionsToDelete = existingSections.Where(es => sections.All(s => s.id != es.id)).ToList();
            var sectionsToUpdate = sections.Where(s => existingSections.Any(es => es.id == s.id)).ToList();
            var sectionsToCreate = sections.Where(s => existingSections.All(es => es.id != s.id)).ToList().Select(s =>
            {
                s.fk_form_id = formId;
                return s;
            }).ToList();


            foreach (var section in sectionsToUpdate)
            {
                var existingSection = existingSections.First(es => es.id == section.id);
                existingSection.type = section.type;
                existingSection.title = section.title;
                existingSection.index = section.index;
                existingSection.description = section.description;
                existingSection.required = section.required;
                existingSection.options = section.options;
                existingSection.min = section.min;
                existingSection.max = section.max;
                existingSection.updated_at = DateTime.UtcNow;
            }

            _context.section.RemoveRange(sectionsToDelete);
            _context.section.AddRange(sectionsToCreate);

            _context.SaveChanges();
        }
    }
}