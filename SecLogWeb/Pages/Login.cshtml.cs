using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;


namespace SecLogWeb.Pages
{
    public class LoginModel : PageModel
    {

        public LoginModel()
        {
        }

        [BindProperty]
        public string Email { get; set; } = string.Empty;

        [BindProperty]
        public string Password { get; set; } = string.Empty;

        public void OnGet()
        {

        }

        public IActionResult OnPost()
        {
            if (string.IsNullOrWhiteSpace(Email) || string.IsNullOrWhiteSpace(Password))
            {
                ModelState.AddModelError(string.Empty, "Vul e-mail en wachtwoord in.");
                return Page();
            }

            Db db = new Db();
            var users = db.GetAllUsers();

            var email = Email.Trim();
            var user = users.FirstOrDefault(u => u.Email == email);
            if (user != null)
            {
                try
                {
                    var pm = new Passwordmanager();

                    // Verify using the stored combined Base64(salt+hash)
                    if (!string.IsNullOrEmpty(user.PasswordHash) && pm.VerifyPassword(Password, user.PasswordHash))
                    {
                        return RedirectToPage("/Dashboard");
                    }

                    ModelState.AddModelError(string.Empty, "Verkeerd e-mail of wachtwoord.");
                    return Page();
                }
                catch
                {
                    ModelState.AddModelError(string.Empty, "Verkeerd e-mail of wachtwoord.");
                    return Page();
                }
            }

            ModelState.AddModelError(string.Empty, "Onjuiste inloggegevens.");
            return Page();
        }
    }
}
