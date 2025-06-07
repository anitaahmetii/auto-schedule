using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data; // Namespace ku ke AppDbContext-in

public class CleanupExpiredCodesService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public CleanupExpiredCodesService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var now = DateTime.UtcNow;
                var expiredCodes = await context.AttendanceCodePeriods
                    .Where(c => c.EndDateTime <= now)
                    .ToListAsync(stoppingToken);

                if (expiredCodes.Any())
                {
                    context.AttendanceCodePeriods.RemoveRange(expiredCodes);
                    await context.SaveChangesAsync(stoppingToken);
                }
            }

            // Prit 5 minuta para rishikimit të ardhshëm
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}
