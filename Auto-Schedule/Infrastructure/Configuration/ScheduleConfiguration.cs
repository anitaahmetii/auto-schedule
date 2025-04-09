using AutoMapper;
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
    public class ScheduleConfiguration : IEntityTypeConfiguration<Schedule>
    {
        public void Configure(EntityTypeBuilder<Schedule> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne<User>(x => x.User)
               .WithMany(x => x.Schedules)
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<Location>(x => x.Location)
               .WithMany(x => x.Schedules)
               .HasForeignKey(x => x.LocationId)
               .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<Halls>(x => x.Halls)
               .WithMany(x => x.Schedules)
               .HasForeignKey(x => x.HallsId)
               .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<Department>(x => x.Department)
               .WithMany(x => x.Schedules)
               .HasForeignKey(x => x.DepartmentId)
               .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<Group>(x => x.Group)
               .WithMany(x => x.Schedules)
               .HasForeignKey(x => x.GroupId)
               .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
