using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class SectionModel : BaseModel
    {
        [JsonPropertyName("fkFormId")]
        public Guid fk_form_id { get; set; }
        public string type { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public int index { get; set; }
        public string description { get; set; } = string.Empty;
        public bool required { get; set; } = false;
        public int? min { get; set; }
        public int? max { get; set; }

        [JsonPropertyName("acceptedFileTypes")]
        public string? accepted_file_types { get; set; }

        [Column(TypeName = "jsonb")]
        public object? options { get; set; }
    }
}

