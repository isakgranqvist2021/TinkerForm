namespace api.Models
{
    public class AnswerModel
    {
        public Guid id { get; set; }
        public Guid fk_form_id { get; set; }
        public Guid fk_response_id { get; set; }
        public Guid fk_section_id { get; set; }

        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }

        public string? answer_text { get; set; }
        public int? answer_number { get; set; }
        public bool? answer_boolean { get; set; }
        public string? answer_file { get; set; }
    }
}