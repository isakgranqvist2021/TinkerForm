using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using api.Dto;

namespace api.Models
{
    public class FormModel : BaseModel
    {
        [Required]
        public string email { get; set; } = string.Empty;

        [JsonPropertyName("pausedAt")]
        public DateTime? paused_at { get; set; } = null;

        [NotMapped]
        [JsonPropertyName("totalResponses")]
        public int? total_responses { get; set; } = null;

        [NotMapped]
        [JsonPropertyName("completedResponses")]
        public int? completed_responses { get; set; } = null;

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
}