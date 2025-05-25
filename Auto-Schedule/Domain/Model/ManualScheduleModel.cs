using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class ManualScheduleModel
    {
        public Guid? Id { get; set; }
        public String Day { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public Guid CourseLecturesId { get; set; }
        public Guid HallsId { get; set; }
        public Guid LocationId { get; set; }
        public Guid DepartmentId { get; set; }
        public Guid GroupId { get; set; }
        //public Guid? UserId { get; set; }
    }
}
