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
    public class LocationDepartmentConfiguration : IEntityTypeConfiguration<LocationDepartment>
    {
        public void Configure(EntityTypeBuilder<LocationDepartment> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Location)
                   .WithMany(x => x.LocationDepartments)
                   .HasForeignKey(x => x.LocationId);

            builder.HasOne(ur => ur.Department)
                .WithMany(r => r.LocationDepartments)
                .HasForeignKey(ur => ur.DepartmentId);

        }
    }
}
