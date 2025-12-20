using System.Text.Json.Serialization;
using api.Models;

namespace api.Dto
{
    public class StatsDto
    {
        [JsonPropertyName("currentMonth")]
        public StatsModel current_month { get; set; } = new StatsModel();

        [JsonPropertyName("previousMonth")]
        public StatsModel previous_month { get; set; } = new StatsModel();
    }
}