using System.Text.Json.Serialization;

namespace api.Models
{
    public class StatsModel
    {
        [JsonPropertyName("totalResponses")]
        public int total_responses { get; set; }

        [JsonPropertyName("completedResponses")]
        public int completed_responses { get; set; }
    }
}