using Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Configuration
{
    public class LecturesConfiguration : IEntityTypeConfiguration<Lectures>
    {
        public void Configure(EntityTypeBuilder<Lectures> builder)
        {
            builder.HasOne<ScheduleType>(x => x.ScheduleType)
               .WithMany(x => x.Lectures)
               .HasForeignKey(x => x.ScheduleTypeId)
               .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
