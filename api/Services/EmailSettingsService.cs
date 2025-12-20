using api.Context;
using api.Dto;
using api.Models;

namespace api.Services
{
    public class EmailSettingsService
    {
        private readonly AppDbContext _context;

        public EmailSettingsService(AppDbContext context)
        {
            _context = context;
        }

        public void UpdateSettings(UpdateEmailSettingsDto updateEmailSettingsDto, string email)
        {
            var settings = _context.email_settings.FirstOrDefault(settings => settings.email == email);
            if (settings != null)
            {
                settings.updated_at = DateTime.UtcNow;
                settings.marketing = updateEmailSettingsDto.marketing;
                settings.product_updates = updateEmailSettingsDto.product_updates;
            }
            else
            {
                _context.email_settings.Add(new EmailSettingsModel
                {
                    email = email,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow,
                    marketing = updateEmailSettingsDto.marketing,
                    product_updates = updateEmailSettingsDto.product_updates,
                });
            }

            _context.SaveChanges();
        }


        public EmailSettingsModel? GetSettings(string email)
        {
            return _context.email_settings.FirstOrDefault(settings => settings.email == email);
        }
    }
}