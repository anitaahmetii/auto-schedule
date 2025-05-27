using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<User, Role, Guid>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Student> Students {get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Staff> Staff { get; set; }
        public DbSet<Receptionist> Receptionists { get; set; }
        public DbSet<Lectures> Lectures { get; set; }
        public DbSet<ScheduleType> ScheduleType { get; set; }
        public DbSet<Coordinator> Coordinators { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseLectures> CourseLectures { get; set; }
        public DbSet<LocationDepartment> LocationDepartment { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Location> Location { get; set; }
        public DbSet<Halls> Halls { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<GroupSelectionPeriod> GroupSelectionPeriods { get; set; }


    }
}
