using Microsoft.EntityFrameworkCore;

namespace api.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Models.FormModel> form { get; set; }
        public DbSet<Models.SectionModel> section { get; set; }
        public DbSet<Models.ResponseModel> response { get; set; }
        public DbSet<Models.AnswerModel> answer { get; set; }
        public DbSet<Models.SubscriptionModel> subscription { get; set; }
        public DbSet<Models.ContactModel> contact { get; set; }
    }

}