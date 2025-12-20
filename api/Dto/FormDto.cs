using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using api.Models;

namespace api.Dto
{
    public class FormStatsDto
    {
        [JsonPropertyName("totalResponses")]
        public int total_responses { get; set; }

        [JsonPropertyName("completedResponses")]
        public int completed_responses { get; set; }
    }

    public class FormWithAnswersDto
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

        public List<ResponseWithAnswersDto> responses { get; set; } = [];
    }


    public class CreateFormDto
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
        [JsonPropertyName("maxResponses")]
        public int max_responses { get; set; } = 0;

        [Required]
        [JsonPropertyName("startDate")]
        public DateTime start_date { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("endDate")]
        public DateTime end_date { get; set; } = DateTime.UtcNow;
    }

    public class UpdateFormDto
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
        [JsonPropertyName("maxResponses")]
        public int max_responses { get; set; } = 0;

        [Required]
        [JsonPropertyName("startDate")]
        public DateTime start_date { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("endDate")]
        public DateTime end_date { get; set; } = DateTime.UtcNow;

        [Required]
        public List<SectionModel> sections { get; set; } = [];
    }
}