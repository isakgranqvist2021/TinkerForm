namespace api.Models
{
    public class FormModel
    {
        public Guid id { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string email { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string location { get; set; } = string.Empty;
    }
}