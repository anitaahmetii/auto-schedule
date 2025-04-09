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
    public class HallsConfiguration : IEntityTypeConfiguration<Halls>
    {
        public void Configure(EntityTypeBuilder<Halls> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne<User>(x => x.User)
               .WithMany(x => x.Halls)
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<Location>(x => x.Location)
              .WithMany(x => x.Halls)
              .HasForeignKey(x => x.LocationId)
              .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
