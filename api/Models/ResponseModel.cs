namespace api.Models
{

    public class ResponseModel
    {
        public Guid id { get; set; }
        public Guid fk_form_id { get; set; }

        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }

        public DateTime? completed_at { get; set; }
    }
}