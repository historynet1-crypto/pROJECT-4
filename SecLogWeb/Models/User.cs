namespace SecLogWeb.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        // Base64-encoded salt
        public string PasswordSalt { get; set; } = string.Empty;
        // Base64-encoded hash
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    } 
    

   










}



