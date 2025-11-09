using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class SubscriptionModel : BaseModel
    {
        [Required]
        public string email { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("subscriptionId")]
        public string subscription_id { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("packageId")]
        public string package_id { get; set; } = string.Empty;
    }
}