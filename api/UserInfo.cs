namespace api
{
    public class UserInfo
    {
        public string Sub { get; set; }
        public string Nickname { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public DateTime Updated_At { get; set; }
        public string Email { get; set; }
        public bool Email_Verified { get; set; }
    }
}
