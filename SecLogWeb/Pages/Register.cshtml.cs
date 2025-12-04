using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SecLogWeb.Pages
{
    public class RegisterModel : PageModel
    {
        [BindProperty]
        public string RegistrationCode { get; set; } = string.Empty;

        [BindProperty]
        public string Email { get; set; } = string.Empty;

        // Hardcoded valid registration codes mapped to allowed email addresses.
        // Only when a user provides the matching code + email can they proceed to create a password.
        private static readonly System.Collections.Generic.Dictionary<string, string> ValidRegistrationPairs =
            new()
            {
                {"4277",  "gay12@hotmail.com"},
                { "2354", "poep@gmail.com" }
            };

        public void OnGet()
        {
        }

        public IActionResult OnPost()
        {
            // Validate required fields first
            if (string.IsNullOrWhiteSpace(RegistrationCode) || string.IsNullOrWhiteSpace(Email))
            {
                ModelState.AddModelError(string.Empty, "Vul zowel de registratiecode als het e-mailadres in.");
                return Page();
            }

            // Normalize inputs
            var code = RegistrationCode.Trim();
            var email = Email.Trim();

            // Check if the code exists and matches the provided email (case-insensitive)
            if (ValidRegistrationPairs.TryGetValue(code, out var expectedEmail) &&
                string.Equals(expectedEmail, email, System.StringComparison.OrdinalIgnoreCase))
            {
                // Valid pair — proceed to create password page and prefill email
                return RedirectToPage("/CreatePassword", new { email = email });
            }

            // Invalid combination
            ModelState.AddModelError(string.Empty, "Onjuiste registratiecode of e-mailadres. Controleer uw gegevens.");
            return Page();
        }
    }
}
