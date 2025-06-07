using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class AttendanceCodePeriodModel
    {
        public Guid? Id { get; set; }
        public string Code { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public Guid ScheduleId { get; set; }
    }
}
