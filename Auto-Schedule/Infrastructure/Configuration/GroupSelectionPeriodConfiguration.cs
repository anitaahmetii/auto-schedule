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
    public class GroupSelectionPeriodConfiguration : IEntityTypeConfiguration<GroupSelectionPeriod>
    {
        public void Configure(EntityTypeBuilder<GroupSelectionPeriod> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne<Department>(x => x.Department)
                .WithMany(x => x.GroupSelectionPeriods)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
