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
        public string theme { get; set; } = string.Empty;

        [Required]
        public string location { get; set; } = string.Empty;

        [Required]
        public string availability { get; set; } = "always";

        [Required]
        [JsonPropertyName("startDate")]
        public DateTime start_date { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("endDate")]
        public DateTime end_date { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("maxResponses")]
        public int max_responses { get; set; } = 0;

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
        public string theme { get; set; } = string.Empty;

        [Required]
        public string location { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("coverImage")]
        public string cover_image { get; set; } = string.Empty;

        [Required]
        public string availability { get; set; } = "always";

        [Required]
        [JsonPropertyName("startDate")]
        public DateTime start_date { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("endDate")]
        public DateTime end_date { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("maxResponses")]
        public int max_responses { get; set; } = 0;
    }

    public class UpdateFormModel
    {
        [Required]
        public string title { get; set; } = string.Empty;

        [Required]
        public string description { get; set; } = string.Empty;

        [Required]
        public string theme { get; set; } = string.Empty;

        [Required]
        public string location { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("coverImage")]
        public string cover_image { get; set; } = string.Empty;

        [Required]
        public string availability { get; set; } = "always";

        [Required]
        [JsonPropertyName("startDate")]
        public DateTime start_date { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("endDate")]
        public DateTime end_date { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("maxResponses")]
        public int max_responses { get; set; } = 0;

        [Required]
        public List<SectionModel> sections { get; set; } = [];
    }

    public class FormStatsModel
    {
        [JsonPropertyName("totalResponses")]
        public int total_responses { get; set; }

        [JsonPropertyName("completedResponses")]
        public int completed_responses { get; set; }
    }

    public class FormWithAnswersModel
    {
        public Guid id { get; set; }

        public string title { get; set; } = string.Empty;

        public string location { get; set; } = string.Empty;

        public string description { get; set; } = string.Empty;

        [Required]
        public string availability { get; set; } = "always";

        [Required]
        [JsonPropertyName("startDate")]
        public DateTime start_date { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("endDate")]
        public DateTime end_date { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("maxResponses")]
        public int max_responses { get; set; } = 0;

        public List<ResponseWithAnswersModel> responses { get; set; } = [];
    }
}