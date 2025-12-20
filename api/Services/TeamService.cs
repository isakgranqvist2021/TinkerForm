using api.Context;
using api.Models;

namespace api.Services
{
    public class TeamService
    {
        private readonly AppDbContext _context;

        public TeamService(AppDbContext context)
        {
            _context = context;
        }

        public bool CreateTeam(string email)
        {
            var team = _context.team.FirstOrDefault(team => team.email == email);
            if (team != null)
            {
                return true;
            }

            var newTeam = new TeamModel
            {
                email = email,
            };

            _context.Add(newTeam);
            _context.SaveChanges();

            return true;
        }
    }
}