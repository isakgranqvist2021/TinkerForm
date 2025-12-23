using System.Text.Json.Serialization;

namespace api.Dto
{
    public class UpdateTeamSettingsDto
    {
        [JsonPropertyName("coverImage")]
        public string? cover_image { get; set; } = null;
    }
}
