using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class ReportModel
    {
        public Guid? Id { get; set; }
        public int Absence { get; set; }
        public string Comment { get; set; }
        public DateTime DateTime { get; set; }

        public Guid? UserId { get; set; }
       
        public Guid? ScheduleId { get; set; }
    }
}
