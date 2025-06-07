using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class AttendanceModel
    {
        public Guid? Id { get; set; }
        public DateTime ConfirmationTime { get; set; }
        public Guid StudentId { get; set; }
        public Guid ScheduleId { get; set; }
    }
}
