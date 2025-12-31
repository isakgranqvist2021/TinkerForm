using api.Context;
using api.Dto;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class EmailSettingsService(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public async Task UpdateSettings(UpdateEmailSettingsDto updateEmailSettingsDto, string email)
        {
            var settings = await _context.email_settings.FirstOrDefaultAsync(settings => settings.email == email);
            if (settings != null)
            {
                settings.updated_at = DateTime.UtcNow;
                settings.marketing = updateEmailSettingsDto.marketing;
                settings.product_updates = updateEmailSettingsDto.product_updates;
            }
            else
            {
                await _context.email_settings.AddAsync(new EmailSettingsModel
                {
                    email = email,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow,
                    marketing = updateEmailSettingsDto.marketing,
                    product_updates = updateEmailSettingsDto.product_updates,
                });
            }

            await _context.SaveChangesAsync();
        }


        public async Task<EmailSettingsModel?> GetSettings(string email)
        {
            return await _context.email_settings.FirstOrDefaultAsync(settings => settings.email == email);
        }
    }
}