using api.Context;

namespace api.Services
{
    public class ModelService
    {
        public readonly FormService formService;
        public readonly ResponseService responseService;
        public readonly AnswerService answerService;
        public readonly SectionService sectionService;
        public readonly SubscriptionService subscriptionService;
        public readonly StatsService statsService;

        public readonly ContactService contactService;

        public ModelService(AppDbContext context)
        {
            formService = new FormService(context);
            responseService = new ResponseService(context);
            answerService = new AnswerService(context);
            sectionService = new SectionService(context);
            subscriptionService = new SubscriptionService(context);
            statsService = new StatsService(context);
            contactService = new ContactService(context);
        }
    }
}