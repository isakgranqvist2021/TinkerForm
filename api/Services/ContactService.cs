using api.Context;
using api.Models;

namespace api.Services
{
    public class ContactService(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public async Task AddContact(ContactModel contact)
        {
            await _context.contact.AddAsync(contact);
            await _context.SaveChangesAsync();
        }
    }
}