using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ScheduleType
    {
        public Guid Id { get; set; }
        public ScheduleTypes  scheduleTypes { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public ICollection<Lectures> Lectures { get; set; } = new List<Lectures>();
    }
}
