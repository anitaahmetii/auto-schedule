using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class AttendanceCodePeriod
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public DateTime StartDateTime { get; set; }  
        public DateTime EndDateTime { get; set; }
        public Guid ScheduleId { get; set; }
        public Schedule Schedule { get; set; }
    }
}
