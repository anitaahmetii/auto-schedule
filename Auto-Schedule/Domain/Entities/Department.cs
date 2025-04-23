using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Department
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        //public Guid UserId { get; set; }
       // public User User { get; set; }

        public ICollection<LocationDepartment> LocationDepartments { get; set; } = new List<LocationDepartment>();

        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    }
}
