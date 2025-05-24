using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Infrastructure.Configuration
{
    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {

            builder.HasOne<Group>(x => x.Group)
                .WithMany(x => x.Students)
                .HasForeignKey(x => x.GroupId)
                .OnDelete(DeleteBehavior.NoAction);
            builder.HasOne<Department>(x => x.Department)
                .WithMany(x => x.Students)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
