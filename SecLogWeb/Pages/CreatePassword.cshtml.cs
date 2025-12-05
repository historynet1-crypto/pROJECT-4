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
            var existing = db.GetAllUsers().FirstOrDefault(u => u.PasswordHash == Password);
            if (existing != null)
            {
                ModelState.AddModelError(string.Empty, "Er bestaat al een account met dit e-mailadres.");
                return Page();
            }
            RedirectToPage("/index");
        


            Passwordmanager passwordmanager = new Passwordmanager();
            User user = new User()
            {
                Email = email,
                PasswordHash = passwordmanager.HashPassword(Password),
                CreatedAt = DateTime.UtcNow
            };
            db.AddUser(user);

            // After creating the account, redirect to login
            return RedirectToPage("/Login");
        }
    }
}
