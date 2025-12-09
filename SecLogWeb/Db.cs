using MySql.Data.MySqlClient;
using SecLogWeb.Models;

namespace SecLogWeb
{
    public class Db
    {

        private readonly string _connectionString= "server=192.168.127.9;port=3306;database=seclog;user id=student;password=student;SslMode=Preferred;AllowPublicKeyRetrieval=True;CharSet=latin1;Pooling=true;ConnectionTimeout=30;";


        public Db()
        {
       

        }

        // Read all users
        public  List<User> GetAllUsers()
        {
            var users = new List<User>();
            const string sql = "SELECT * FROM `account`";
             using var conn = new MySqlConnection(_connectionString);
             conn.Open();

             using var cmd = new MySqlCommand(sql, conn);
             using var reader =  cmd.ExecuteReader();

            while (reader.Read())
            {
                User user = new User();
                user.Id = reader.GetInt32("id");
                user.Email = reader.GetString("email");
                user.PasswordHash = reader.IsDBNull(reader.GetOrdinal("wachtwoord")) ? string.Empty : reader.GetString("wachtwoord");
                users.Add(user);
                
            }

            return users;

        }

        // Read single user by email
        public User? GetUserByEmail(string email)
        {
            const string sql = "SELECT * FROM `account` WHERE email = @email LIMIT 1";
            using var conn = new MySqlConnection(_connectionString);
            conn.Open();

            using var cmd = new MySqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@email", email);
            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                User user = new User();
                user.Id = reader.GetInt32("id");
                user.Email = reader.GetString("email");
                user.PasswordHash = reader.IsDBNull(reader.GetOrdinal("wachtwoord")) ? string.Empty : reader.GetString("wachtwoord");
                return user;
            }

            return null;
        }


        //public GetByEmail(string user)
        //{
        //    using var conn = new MySqlConnection(_connectionString);
        //    conn.Open();

        //    string query = "SELECT @email FROM accounts";

        //    MySqlCommand command = new MySqlCommand(query, conn);
        //    command.Parameters.AddWithValue("@email", user.Email);

        //}

        

        public bool AddUser(User user)
        {
            using var conn = new MySqlConnection(_connectionString);
            conn.Open();

            // If caller didn't provide an id, try to look it up by email
            if (user.Id == 0 && !string.IsNullOrWhiteSpace(user.Email))
            {
                const string selectSql = "SELECT id FROM account WHERE email = @email LIMIT 1";
                using var selCmd = new MySqlCommand(selectSql, conn);
                selCmd.Parameters.AddWithValue("@email", user.Email);
                var scalar = selCmd.ExecuteScalar();
                if (scalar != null && int.TryParse(scalar.ToString(), out int id))
                {
                    user.Id = id;
                }
            }

            // Require an id to perform the update
            if (user.Id == 0)
            {
                return false;
            }

            const string query = "UPDATE account SET wachtwoord=@wachtwoord WHERE id=@id";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@wachtwoord", (object?)user.PasswordHash ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@id", user.Id);

            int rows = cmd.ExecuteNonQuery();
            return rows > 0;
        }

    }




}

