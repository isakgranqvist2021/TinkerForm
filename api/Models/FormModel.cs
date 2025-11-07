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

        [NotMapped]
        [JsonPropertyName("responseCount")]
        public int? response_count { get; set; } = null;
    }
}