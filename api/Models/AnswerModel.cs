using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class AnswerModel : BaseModel
    {
        [Required]
        [JsonPropertyName("fkFormId")]
        public Guid fk_form_id { get; set; }

        [Required]
        [JsonPropertyName("fkResponseId")]
        public Guid fk_response_id { get; set; }

        [Required]
        [JsonPropertyName("fkSectionId")]
        public Guid fk_section_id { get; set; }

        [JsonPropertyName("answerText")]
        public string? answer_text { get; set; }

        [JsonPropertyName("answerNumber")]
        public int? answer_number { get; set; }

        [JsonPropertyName("answerBoolean")]
        public bool? answer_boolean { get; set; }

        [JsonPropertyName("answerFile")]
        public string? answer_file { get; set; }
    }
}