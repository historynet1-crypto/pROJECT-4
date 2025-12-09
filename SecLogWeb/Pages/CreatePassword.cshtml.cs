using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.RegularExpressions;
using System.Security.Cryptography;
using System.Text;
using SecLogWeb.Models;

namespace SecLogWeb.Pages
{
    public class CreatePasswordModel : PageModel
    {
       

        [BindProperty(SupportsGet = true)]
        public string Email { get; set; } = string.Empty;

        [BindProperty]
        public string Password { get; set; } = string.Empty;

        [BindProperty]
        public string ConfirmPassword { get; set; } = string.Empty;

        public void OnGet()
        {
            // Email can be shown or used to prefill if passed from register
        }

        public IActionResult OnPost()
        {
            // Basic validation
            if (string.IsNullOrWhiteSpace(Password) || string.IsNullOrWhiteSpace(ConfirmPassword))
            {
                ModelState.AddModelError(string.Empty, "Vul beide wachtwoordvelden in.");
                return Page();
            }

            if (Password.Length < 6)
            {
                ModelState.AddModelError(string.Empty, "Wachtwoord moet minimaal 6 tekens bevatten.");
                return Page();
            }

            // Require at least one non-alphanumeric (special) character
            if (!Regex.IsMatch(Password, "[^a-zA-Z0-9]"))
            {
                ModelState.AddModelError(string.Empty, "Wachtwoord moet minstens één speciaal teken bevatten (bijv. !@#%).");
                return Page();
            }

            if (Password != ConfirmPassword)
            {
                ModelState.AddModelError(string.Empty, "Wachtwoorden komen niet overeen met elkaar.");
                return Page();
            }

            // Save the new user to the database (if not exists)
            var email = Email?.Trim() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(email))
            {
                ModelState.AddModelError(string.Empty, "E-mailadres ontbreekt.");
                return Page();
            }

            // Check if user already exists
            Db db = new Db();
            var existing = db.GetUserByEmail(email);
            if (existing == null)
            {
                ModelState.AddModelError(string.Empty, "Euir bestaat geen account met dit e-mailadres.");
                return Page();
            }

            // If the account already has a password, prevent overwriting
            if (!string.IsNullOrWhiteSpace(existing.PasswordHash))
            {
                ModelState.AddModelError(string.Empty, "Er is al een wachtwoord ingesteld voor dit account.");
                return Page();
            }

            Passwordmanager passwordmanager = new Passwordmanager();
            User user = new User()
            {
                Id = existing.Id,
                Email = email,
                PasswordHash = passwordmanager.HashPassword(Password),
                CreatedAt = DateTime.UtcNow
            };

            var updated = db.AddUser(user);
            if (!updated)
            {
                ModelState.AddModelError(string.Empty, "Wachtwoord kon niet worden bijgewerkt. Probeer het later opnieuw.");
                return Page();
            }

            // After creating the account, redirect to login
            return RedirectToPage("/Login");
            
        }
    }
}
