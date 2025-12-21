using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class TeamModel : BaseModel
    {
        [Required]
        public string email { get; set; } = string.Empty;

        public string? title { get; set; } = null;

        public string? description { get; set; } = null;
    }
}