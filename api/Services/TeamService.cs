using api.Context;
using api.Dto;
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


        public TeamModel? GetById(Guid id)
        {
            return _context.team.FirstOrDefault(team => team.id == id);
        }

        public TeamModel? GetByEmail(string email)
        {
            return _context.team.FirstOrDefault(team => team.email == email);
        }

        public TeamModel? UpdateSettings(UpdateTeamSettingsDto updateTeamSettingsDto, string email)
        {
            var team = _context.team.FirstOrDefault(team => team.email == email);
            if (team == null)
            {
                return null;
            }

            team.updated_at = DateTime.UtcNow;
            team.title = updateTeamSettingsDto.title;
            team.description = updateTeamSettingsDto.description;
            team.cover_image = updateTeamSettingsDto.cover_image;
            team.logo = updateTeamSettingsDto.logo;

            _context.SaveChanges();

            return team;
        }
    }
}
