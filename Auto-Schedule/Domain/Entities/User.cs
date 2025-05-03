using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class User: IdentityUser<Guid>
    {
        public string LastName { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public ICollection<Group> Groups { get; set; } = new List<Group>();
        public ICollection<Course> Courses { get; set; } = new List<Course>();
        public ICollection<ScheduleType> ScheduleType { get; set; } = new List<ScheduleType>();
        public ICollection<Department> Departments { get; set; } = new List<Department>();
        public ICollection<Location> Locations { get; set; } = new List<Location>();
        public ICollection<Halls> Halls { get; set; } = new List<Halls>();
        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
        public ICollection<Report> Reports { get; set; } = new List<Report>();
    }
}
