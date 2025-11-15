using api.Context;
using api.Models;

namespace api.Services
{
    public class StatsService
    {
        private readonly AppDbContext _context;

        public StatsService(AppDbContext context)
        {
            _context = context;
        }

        public StatsDto GetFormStats(string email)
        {
            // pick the user's timezone (try "Europe/Oslo" first, fall back to server local)
            TimeZoneInfo userTz;
            try
            {
                userTz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Oslo");
            }
            catch
            {
                userTz = TimeZoneInfo.Local;
            }

            // "now" in user's timezone
            var nowUserTz = TimeZoneInfo.ConvertTime(DateTime.UtcNow, userTz);

            // month boundaries in user's timezone
            var startOfCurrentMonthUserTz = new DateTime(nowUserTz.Year, nowUserTz.Month, 1, 0, 0, 0, DateTimeKind.Unspecified);
            var startOfNextMonthUserTz = startOfCurrentMonthUserTz.AddMonths(1);
            var startOfPreviousMonthUserTz = startOfCurrentMonthUserTz.AddMonths(-1);

            // convert boundaries to UTC for comparison with stored UTC timestamps
            var startOfCurrentMonthUtc = TimeZoneInfo.ConvertTimeToUtc(startOfCurrentMonthUserTz, userTz);
            var startOfNextMonthUtc = TimeZoneInfo.ConvertTimeToUtc(startOfNextMonthUserTz, userTz);
            var startOfPreviousMonthUtc = TimeZoneInfo.ConvertTimeToUtc(startOfPreviousMonthUserTz, userTz);
            var endOfPreviousMonthUtc = startOfCurrentMonthUtc;

            // get the user's form ids
            var userFormIds = _context.form
                .Where(form => form.email == email)
                .Select(form => form.id)
                .ToList();

            // if the user has no forms, return zeros
            if (!userFormIds.Any())
            {
                return new StatsDto
                {
                    current_month = new StatsModel { total_responses = 0, completed_responses = 0 },
                    previous_month = new StatsModel { total_responses = 0, completed_responses = 0 }
                };
            }

            // Query responses for the two months
            var currentTotal = _context.response
                .Count(response => userFormIds.Contains(response.fk_form_id)
                            && response.created_at >= startOfCurrentMonthUtc
                            && response.created_at < startOfNextMonthUtc);

            var currentCompleted = _context.response
                .Count(response => userFormIds.Contains(response.fk_form_id)
                            && response.created_at >= startOfCurrentMonthUtc
                            && response.created_at < startOfNextMonthUtc
                            && response.completed_at != null);

            var prevTotal = _context.response
                .Count(response => userFormIds.Contains(response.fk_form_id)
                            && response.created_at >= startOfPreviousMonthUtc
                            && response.created_at < endOfPreviousMonthUtc);

            var prevCompleted = _context.response
                .Count(response => userFormIds.Contains(response.fk_form_id)
                            && response.created_at >= startOfPreviousMonthUtc
                            && response.created_at < endOfPreviousMonthUtc
                            && response.completed_at != null);

            return new StatsDto
            {
                current_month = new StatsModel
                {
                    total_responses = currentTotal,
                    completed_responses = currentCompleted
                },
                previous_month = new StatsModel
                {
                    total_responses = prevTotal,
                    completed_responses = prevCompleted
                }
            };
        }
    }
}