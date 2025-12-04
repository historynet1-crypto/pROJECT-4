using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

// Configure DB provider: prefer a configured connection string (MariaDB/MySQL),
// otherwise fall back to the local SQLite file used during development.

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
  //  var db = scope.ServiceProvider.GetRequiredService<SecLogWeb.Data.AppDbContext>();
    //db.Database.EnsureCreated();
}

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
