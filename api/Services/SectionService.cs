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
    }
}
