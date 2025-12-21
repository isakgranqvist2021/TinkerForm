using System.Text.Json.Serialization;

namespace api.Dto
{
    public class UpdateTeamSettingsDto
    {
        public string? title { get; set; } = null;

        public string? description { get; set; } = null;

        [JsonPropertyName("coverImage")]
        public string? cover_image { get; set; } = null;

        public string? logo { get; set; } = null;
    }
}
