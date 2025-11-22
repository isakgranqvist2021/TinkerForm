using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using api.Context;
using api.Services;
using api.Middleware;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var DATABASE_URL = Environment.GetEnvironmentVariable("DATABASE_URL");
var AUTH0_DOMAIN = Environment.GetEnvironmentVariable("AUTH0_DOMAIN");
var AUTH0_AUDIENCE = Environment.GetEnvironmentVariable("AUTH0_AUDIENCE");
var domain = $"https://{AUTH0_DOMAIN}/";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(DATABASE_URL));
builder.Services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();
builder.Services.AddScoped<ModelService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.Authority = domain;
    options.Audience = AUTH0_AUDIENCE;
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("read:messages", policy => policy.Requirements.Add(new HasScopeRequirement("read:messages", domain)));
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseMiddleware<Auth0UserInfoMiddleware>();
app.UseAuthorization();
app.MapControllers();

app.Run();
