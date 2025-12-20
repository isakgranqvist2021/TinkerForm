using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.Dto
{
    public class QuestionAnswerDto
    {
        public string question { get; set; } = string.Empty;
        public object? answer { get; set; } = string.Empty;
        public string? metadata { get; set; } = null;
    }

    public class ResponseWithAnswersDto
    {
        [JsonPropertyName("responseId")]
        public Guid response_id { get; set; }
        public List<QuestionAnswerDto> answers { get; set; } = [];
    }

    public class UpdateScoreAndReasoningDto
    {
        [JsonPropertyName("responseId")]
        public Guid response_id { get; set; }

        [Required]
        public float score { get; set; }

        [Required]
        public string reasoning { get; set; } = string.Empty;
    }
}