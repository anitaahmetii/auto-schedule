using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class ScheduleTypeModel
    {
        public Guid? Id { get; set; }
        public ScheduleTypes ScheduleTypes { get; set; }
        public Guid UserId { get; set; }
       
    }
}
