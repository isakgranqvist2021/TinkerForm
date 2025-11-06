using api.Context;

namespace api.Services
{
    public class ModelService
    {
        public readonly FormService formService;
        public readonly ResponseService responseService;

        public ModelService(AppDbContext context)
        {
            formService = new FormService(context);
            responseService = new ResponseService(context);
        }
    }
}