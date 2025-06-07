using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configuration
{
    public class AttendanceCodePeriodConfiguration : IEntityTypeConfiguration<AttendanceCodePeriod>
    {
        public void Configure(EntityTypeBuilder<AttendanceCodePeriod> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne<Schedule>(cl => cl.Schedule)
                .WithMany(c => c.AttendanceCodePeriods)
                .HasForeignKey(cl => cl.ScheduleId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
