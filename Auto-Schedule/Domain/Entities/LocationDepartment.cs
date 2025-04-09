using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class LocationDepartment
    {
        public Guid Id { get; set; }
        public Guid LocationId { get; set; }
        public Location Location { get; set; }

        public Guid DepartmentId { get; set; }
        public Department Department { get; set; }
    }
}
