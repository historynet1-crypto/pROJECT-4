using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace SecLogWeb.Pages
{
    public class RegisterModel : PageModel
    {
        private readonly string _connectionString =
            "server=192.168.127.9;port=3306;database=seclog;user id=student;password=student;SslMode=Preferred;AllowPublicKeyRetrieval=True;CharSet=latin1;Pooling=true;ConnectionTimeout=30;";

        [BindProperty]
        public string RegistrationCode { get; set; } = string.Empty;   // 👈 name matches the view

        [BindProperty]
        public string Email { get; set; } = string.Empty;

        // id (as string) -> email
        private static readonly Dictionary<string, string> ValidRegistrationPairs = new();

        public RegisterModel()
        {
            LoadRegistrationPairsFromDatabase();
        }

        /// <summary>
        /// SELECT query to get all users (rows) from `account`
        /// and fill the ValidRegistrationPairs dictionary.
        /// </summary>
        private void LoadRegistrationPairsFromDatabase()
        {
            if (ValidRegistrationPairs.Count > 0)
                return;

            const string sql = "SELECT id, email FROM `account`";

            using var conn = new MySqlConnection(_connectionString);
            conn.Open();

            using var cmd = new MySqlCommand(sql, conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                int id = reader.GetInt32("id");   // id is INT in DB
                string code = id.ToString();      // we use it as string key
                string email = reader.GetString("email");

                if (!ValidRegistrationPairs.ContainsKey(code))
                {
                    ValidRegistrationPairs[code] = email;
                }
            }
        }

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
                string.Equals(expectedEmail, email, StringComparison.OrdinalIgnoreCase))
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
