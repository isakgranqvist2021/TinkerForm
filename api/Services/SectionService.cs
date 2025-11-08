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
    }
}
