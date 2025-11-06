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
        public DateTime? completed_at { get; set; }
    }
}