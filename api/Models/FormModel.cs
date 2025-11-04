using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class FormModel : BaseModel
    {
        [Required]
        public string email { get; set; } = string.Empty;

        [Required]
        public string title { get; set; } = string.Empty;

        [Required]
        public string description { get; set; } = string.Empty;

        [Required]
        public string location { get; set; } = string.Empty;
    }
}