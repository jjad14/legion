using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class UserRegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [RegularExpression("(?=^.{6,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$",
        ErrorMessage = "Password must have 1 Uppercase, 1 Lowercase, 1 Numeric value and 1 non-Alphanumeric, with a minimum of 6 characters total")]
        public string Password { get; set; }
    }
}