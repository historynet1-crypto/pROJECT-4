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
                user.PasswordHash = reader.IsDBNull(reader.GetOrdinal("wachtwoord")) ? null : reader.GetString("wachtwoord");
                users.Add(user);
                
            }

            return users;

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
            //const string sql = "INSERT INTO `account`";

            using var conn = new MySqlConnection(_connectionString);
            conn.Open();

            //using var cmd = new MySqlCommand(sql, conn);
            //using var reader = cmd.ExecuteReader();


            //String query = "INSERT INTO dbo.SMS_PW (id,username,password,email) VALUES (@id,@username,@password, @email)";
            String query = "INSERT INTO account (id,email,wachtwoord) VALUES (@id,@email, @wachtwoord)";

            MySqlCommand command = new MySqlCommand(query, conn);
            command.Parameters.AddWithValue("@id", user.Id); //id /email /wachtwoord
            command.Parameters.AddWithValue("@email", user.Email); //id /email /wachtwoord
            command.Parameters.AddWithValue("@wachtwoord", user.PasswordHash); //id /email /wachtwoord

            command.ExecuteNonQuery();



            return true;
        }

    }
}
