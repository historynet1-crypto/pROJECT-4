using Microsoft.Data.Sqlite;
using System.Globalization;

// Usage:
// dotnet run --project tools/DeleteUser -- list
// dotnet run --project tools/DeleteUser -- delete "email@domain"

var argsList = args.ToList();
if (argsList.Count == 0)
{
    Console.WriteLine("Usage: list | delete <email>");
    return 1;
}

var command = argsList[0].ToLowerInvariant();

// Build candidate paths to the DB and pick the first that exists.
var candidates = new List<string>();

// 1) Path relative to the app base directory (when run via dotnet run --project)
try
{
    var p = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "SecLogWeb", "seclog.db"));
    candidates.Add(p);
}
catch { }

// 2) Path relative to current working directory (repo root runs)
try
{
    var cwd = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "SecLogWeb", "seclog.db"));
    candidates.Add(cwd);
}
catch { }

// 3) Absolute path used in this workspace (common during development)
try
{
    var abs = Path.GetFullPath(Path.Combine("C:", "Users", "Thata", "OneDrive", "Desktop", "Sec_Log", "SecLogWeb", "seclog.db"));
    candidates.Add(abs);
}
catch { }

// 4) Search parent directories up to N levels for SecLogWeb/seclog.db
var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
for (int i = 0; i < 6 && dir != null; i++)
{
    try
    {
        var candidate = Path.Combine(dir.FullName, "SecLogWeb", "seclog.db");
        candidates.Add(candidate);
    }
    catch { }
    dir = dir.Parent;
}

// De-duplicate while preserving order
var tried = new List<string>();
foreach (var c in candidates)
{
    if (string.IsNullOrWhiteSpace(c)) continue;
    var full = Path.GetFullPath(c);
    if (!tried.Contains(full)) tried.Add(full);
}

string dbPath = null;
foreach (var t in tried)
{
    if (File.Exists(t))
    {
        dbPath = t;
        break;
    }
}

if (dbPath == null)
{
    Console.WriteLine("Database not found. Tried the following locations:");
    foreach (var t in tried)
    {
        Console.WriteLine(" - " + t);
    }
    Console.WriteLine("If the DB is located elsewhere, pass the full path as the second argument.");
    Console.WriteLine("Example: dotnet run --project tools/DeleteUser -- delete \"email@domain\" C:\\path\\to\\seclog.db");
    return 1;
}

// Allow override of path via optional second argument
if (argsList.Count >= 3)
{
    var overridePath = argsList[2];
    if (File.Exists(overridePath)) dbPath = Path.GetFullPath(overridePath);
}

var connString = $"Data Source={dbPath}";

using var conn = new SqliteConnection(connString);
conn.Open();

if (command == "list")
{
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "SELECT Id, Email, CreatedAt FROM Users ORDER BY Id";
    using var reader = cmd.ExecuteReader();
    Console.WriteLine("Id\tEmail\tCreatedAt");
    while (reader.Read())
    {
        var id = reader.GetInt32(0);
        var email = reader.IsDBNull(1) ? "" : reader.GetString(1);
        var created = reader.IsDBNull(2) ? "" : reader.GetString(2);
        Console.WriteLine($"{id}\t{email}\t{created}");
    }
    return 0;
}
else if (command == "delete")
{
    if (argsList.Count < 2)
    {
        Console.WriteLine("Please provide an email to delete.");
        return 1;
    }
    var emailToDelete = argsList[1];
    using var checkCmd = conn.CreateCommand();
    checkCmd.CommandText = "SELECT COUNT(1) FROM Users WHERE lower(Email) = lower($e)";
    checkCmd.Parameters.AddWithValue("$e", emailToDelete);
    var exists = Convert.ToInt32(checkCmd.ExecuteScalar() ?? 0);
    if (exists == 0)
    {
        Console.WriteLine($"No user found with email '{emailToDelete}'.");
        return 0;
    }

    using var delCmd = conn.CreateCommand();
    delCmd.CommandText = "DELETE FROM Users WHERE lower(Email) = lower($e)";
    delCmd.Parameters.AddWithValue("$e", emailToDelete);
    var affected = delCmd.ExecuteNonQuery();
    Console.WriteLine($"Deleted {affected} row(s) for '{emailToDelete}'.");

    // show remaining users
    using var listCmd = conn.CreateCommand();
    listCmd.CommandText = "SELECT Id, Email, CreatedAt FROM Users ORDER BY Id";
    using var reader = listCmd.ExecuteReader();
    Console.WriteLine("Remaining users:");
    Console.WriteLine("Id\tEmail\tCreatedAt");
    while (reader.Read())
    {
        var id = reader.GetInt32(0);
        var email = reader.IsDBNull(1) ? "" : reader.GetString(1);
        var created = reader.IsDBNull(2) ? "" : reader.GetString(2);
        Console.WriteLine($"{id}\t{email}\t{created}");
    }

    return 0;
}
else
{
    Console.WriteLine("Unknown command. Use 'list' or 'delete <email>'.");
    return 1;
}
