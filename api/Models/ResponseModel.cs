using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.Models
{

    public class ResponseModel : BaseModel
    {
        [Required]
        [JsonPropertyName("fkFormId")]
        public Guid fk_form_id { get; set; }

        [JsonPropertyName("completedAt")]
        public DateTime? completed_at { get; set; } = null;

        public float? score { get; set; } = null;

        public string? reasoning { get; set; } = null;
    }

    public class QuestionAnswerModel
    {
        public string question { get; set; } = string.Empty;
        public object? answer { get; set; } = string.Empty;
        public string? metadata { get; set; } = null;
    }

    public class ResponseWithAnswersModel
    {
        [JsonPropertyName("responseId")]
        public Guid response_id { get; set; }
        public List<QuestionAnswerModel> answers { get; set; } = [];
    }

    public class UpdateScoreAndReasoningModel
    {
        [JsonPropertyName("responseId")]
        public Guid response_id { get; set; }

        [Required]
        public float score { get; set; }

        [Required]
        public string reasoning { get; set; } = string.Empty;
    }
}