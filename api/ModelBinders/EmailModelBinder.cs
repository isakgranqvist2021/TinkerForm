using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace api.ModelBinders
{
    public class EmailModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var email = bindingContext.HttpContext.User.Claims
                .FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            bindingContext.Result = ModelBindingResult.Success(email);
            return Task.CompletedTask;
        }
    }

    public class FromEmailAttribute : ModelBinderAttribute
    {
        public FromEmailAttribute() : base(typeof(EmailModelBinder)) { }
    }
}
