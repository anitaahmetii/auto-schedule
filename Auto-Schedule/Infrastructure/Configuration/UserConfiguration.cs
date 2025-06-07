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
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne<City>(x => x.City)
             .WithMany(x => x.Users)
             .HasForeignKey(x => x.CityId)
             .OnDelete(DeleteBehavior.NoAction);
            builder.HasIndex(x => x.PersonalID)
                .IsUnique();
            builder.HasIndex(x => x.PersonalEmail) 
                .IsUnique();
        }
    }
}
