using System.Text.Json.Serialization;

namespace api.Models
{
    public class SectionModel : BaseModel
    {
        [JsonPropertyName("formId")]
        public Guid fk_form_id { get; set; }
        public string type { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public int index { get; set; }
        public string description { get; set; } = string.Empty;
        public bool required { get; set; } = false;
        public int? min { get; set; }
        public int? max { get; set; }
    }
}

