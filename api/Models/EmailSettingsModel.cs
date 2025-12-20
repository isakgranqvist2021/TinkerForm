using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class EmailSettingsModel : BaseModel
    {
        [Required]
        public string email { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("productUpdates")]
        public bool product_updates { get; set; } = true;

        [Required]
        [JsonPropertyName("marketing")]
        public bool marketing { get; set; } = true;
    }
}