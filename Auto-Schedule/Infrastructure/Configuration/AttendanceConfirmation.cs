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
    public class AttendanceConfirmation : IEntityTypeConfiguration<Attendance>
    {
        public void Configure(EntityTypeBuilder<Attendance> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne<User>(x => x.Student)
                .WithMany(x => x.Attendances)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<Schedule>(x => x.Schedule)
               .WithMany(x => x.Attendances)
               .HasForeignKey(x => x.ScheduleId)
               .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
