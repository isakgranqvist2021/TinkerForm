using api.Context;
using api.Models;

namespace api.Services
{
    public class SubscriptionService
    {
        private readonly AppDbContext _context;

        public SubscriptionService(AppDbContext context)
        {
            _context = context;
        }

        public SubscriptionModel Create(SubscriptionModel subscription)
        {
            _context.subscription.Add(subscription);
            _context.SaveChanges();

            return subscription;
        }

        public SubscriptionModel? GetByEmail(string email)
        {
            return _context.subscription.FirstOrDefault(s => s.email == email);
        }
    }
}