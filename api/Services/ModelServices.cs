using api.Context;

namespace api.Services
{
    public class ModelService
    {
        public readonly FormService formService;
        public readonly ResponseService responseService;
        public readonly AnswerService answerService;
        public readonly SectionService sectionService;

        public ModelService(AppDbContext context)
        {
            formService = new FormService(context);
            responseService = new ResponseService(context);
            answerService = new AnswerService(context);
            sectionService = new SectionService(context);
        }
    }
}