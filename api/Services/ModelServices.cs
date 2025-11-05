using api.Context;

namespace api.Services
{
    public class ModelService
    {
        public readonly FormService formService;

        public ModelService(AppDbContext context)
        {
            formService = new FormService(context);
        }
    }
}