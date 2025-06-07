using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Attendance
    {
        public Guid Id { get; set; }
        public DateTime ConfirmationTime { get; set; }
        public Guid StudentId { get; set; }
        public User Student { get; set; }
        public Guid ScheduleId { get; set; }
        public Schedule Schedule { get; set; }
    }
}
