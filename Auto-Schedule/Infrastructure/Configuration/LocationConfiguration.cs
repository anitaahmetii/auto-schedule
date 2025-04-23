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
    public class LocationConfiguration : IEntityTypeConfiguration<Location>
    {
        public void Configure(EntityTypeBuilder<Location> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasIndex(x => x.PhoneNumber).IsUnique();

            //builder.HasOne<User>(x => x.User)
            //   .WithMany(x => x.Locations)
            //   .HasForeignKey(x => x.UserId)
            //   .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
