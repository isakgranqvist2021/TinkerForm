namespace api.Models
{
    public class SectionModel
    {
        public Guid id { get; set; }
        public Guid fk_form_id { get; set; }

        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }

        public string type { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public int index { get; set; }
        public string description { get; set; } = string.Empty;
        public bool required { get; set; } = false;
        public int? min { get; set; }
        public int? max { get; set; }
    }
}

