using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.Dto
{
    public class UpdateEmailSettingsDto
    {
        [Required]
        [JsonPropertyName("productUpdates")]
        public bool product_updates { get; set; } = true;

        [Required]
        [JsonPropertyName("marketing")]
        public bool marketing { get; set; } = true;
    }
}