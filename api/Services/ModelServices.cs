using api.Context;

namespace api.Services
{
    public class ModelService(AppDbContext context)
    {
        public readonly FormService formService = new(context);
        public readonly ResponseService responseService = new(context);
        public readonly AnswerService answerService = new(context);
        public readonly SectionService sectionService = new(context);
        public readonly SubscriptionService subscriptionService = new(context);
        public readonly StatsService statsService = new(context);
        public readonly ContactService contactService = new(context);
        public readonly EmailSettingsService emailSettingsService = new(context);
        public readonly TeamService teamService = new(context);
    }
}