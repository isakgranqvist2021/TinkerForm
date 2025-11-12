using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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

        [Required]
        [JsonPropertyName("coverImage")]
        public string cover_image { get; set; } = string.Empty;

        [NotMapped]
        [JsonPropertyName("responseCount")]
        public int? response_count { get; set; } = null;
    }

    public class CreateFormModel
    {
        [Required]
        public string title { get; set; } = string.Empty;

        [Required]
        public string description { get; set; } = string.Empty;

        [Required]
        public string location { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("coverImage")]
        public string cover_image { get; set; } = string.Empty;
    }

    public class UpdateFormModel
    {
        [Required]
        public string title { get; set; } = string.Empty;

        [Required]
        public string description { get; set; } = string.Empty;

        [Required]
        public string location { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("coverImage")]
        public string cover_image { get; set; } = string.Empty;

        [Required]
        public List<SectionModel> sections { get; set; } = [];
    }

    public class FormStats
    {
        [JsonPropertyName("totalResponses")]
        public int total_responses { get; set; }

        [JsonPropertyName("completedResponses")]
        public int completed_responses { get; set; }
    }
}