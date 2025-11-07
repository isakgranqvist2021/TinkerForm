using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class BaseModel
    {
        [Key]
        public Guid id { get; set; }

        [Required]
        [JsonPropertyName("createdAt")]
        public DateTime created_at { get; set; } = DateTime.UtcNow;

        [Required]
        [JsonPropertyName("updatedAt")]
        public DateTime updated_at { get; set; } = DateTime.UtcNow;
    }
}