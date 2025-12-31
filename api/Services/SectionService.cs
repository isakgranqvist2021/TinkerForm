using api.Context;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class SectionService(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public IEnumerable<SectionModel> GetByFormId(Guid formId)
        {
            return _context.section
                .Where(s => s.fk_form_id == formId)
                .ToList();
        }

        public IEnumerable<SectionModel> Create(IEnumerable<SectionModel> sections, string email)
        {
            var createdSections = new List<SectionModel>();

            var formIds = sections.Select(section => section.fk_form_id).Distinct().ToList();
            var forms = _context.form
               .Where(form => formIds.Contains(form.id) && form.email == email)
               .ToDictionary(form => form.id);

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

        public async Task UpsertSections(IEnumerable<SectionModel> sections, Guid formId, string email)
        {
            var form = await _context.form.FirstOrDefaultAsync(form => form.id == formId && form.email == email) ?? throw new UnauthorizedAccessException("You do not have permission to modify sections for this form.");
            var existingSections = await _context.section
                .Where(section => section.fk_form_id == formId)
                .ToListAsync();

            var sectionsToDelete = existingSections
                .Where(section => sections.All(s => s.id != section.id))
                .ToList();

            var sectionsToUpdate = sections
                .Where(section => existingSections.Any(existingSection => existingSection.id == section.id))
                .ToList();

            var sectionsToCreate = sections
                .Where(section => existingSections.All(existingSection => existingSection.id != section.id))
                .ToList()
                .Select(section =>
                {
                    section.fk_form_id = formId;
                    return section;
                }).ToList();


            foreach (var section in sectionsToUpdate)
            {
                var existingSection = existingSections.First(existingSection => existingSection.id == section.id);
                existingSection.type = section.type;
                existingSection.title = section.title;
                existingSection.index = section.index;
                existingSection.description = section.description;
                existingSection.required = section.required;
                existingSection.options = section.options;
                existingSection.min = section.min;
                existingSection.max = section.max;
                existingSection.accepted_file_types = section.accepted_file_types;
                existingSection.updated_at = DateTime.UtcNow;
            }

            _context.section.RemoveRange(sectionsToDelete);
            await _context.section.AddRangeAsync(sectionsToCreate);

            await _context.SaveChangesAsync();
        }
    }
}