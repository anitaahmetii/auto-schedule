using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Halls
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }

        //public Guid UserId { get; set; }
        //public User User { get; set; }

        public Guid LocationId { get; set; }
        public Location Location { get; set; }
        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    }
}
