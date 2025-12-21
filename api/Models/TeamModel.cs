using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class TeamModel : BaseModel
    {
        [Required]
        public string email { get; set; } = string.Empty;

        public string? title { get; set; } = null;

        public string? description { get; set; } = null;

        [JsonPropertyName("coverImage")]
        [NotMapped]
        public string? cover_image { get; set; } = null;

        [NotMapped]
        public string? logo { get; set; } = null;
    }
}