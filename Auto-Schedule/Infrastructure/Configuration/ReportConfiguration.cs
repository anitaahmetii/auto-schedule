using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configuration
{
    public class ReportConfiguration : IEntityTypeConfiguration<Report>
    {
        public void Configure(EntityTypeBuilder<Report> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.DateTime).ValueGeneratedOnAdd().HasDefaultValueSql("GETDATE()");

            builder.HasOne<User>(x => x.User)
               .WithMany(x => x.Reports)
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<Schedule>(x => x.Schedule)
              .WithOne(x => x.Report)
              .HasForeignKey<Report>(x => x.ScheduleId)
              .OnDelete(DeleteBehavior.NoAction);

        }
    }
}
