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

    public class StatsDto
    {
        [JsonPropertyName("currentMonth")]
        public StatsModel current_month { get; set; } = new StatsModel();

        [JsonPropertyName("previousMonth")]
        public StatsModel previous_month { get; set; } = new StatsModel();
    }
}