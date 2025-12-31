using api.Context;
using api.Models;

namespace api.Services
{
    public class ContactService(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public void AddContact(ContactModel contact)
        {
            _context.contact.Add(contact);
            _context.SaveChanges();
        }
    }
}