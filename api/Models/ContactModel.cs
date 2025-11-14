using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class ContactModel : BaseModel
    {

        [Required]
        [JsonPropertyName("message")]
        public string message { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("name")]
        public string? name { get; set; } = string.Empty;
    }
}