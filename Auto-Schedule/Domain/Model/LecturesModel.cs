using Domain.Entities;
using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class LecturesModel
    {
        public Guid? Id { get; set; }
        public string AcademicGrade { get; set; }
        public LectureType lectureType { get; set; }
        public Guid ScheduleTypeId { get; set; }
        public Guid UserId { get; set; }
    }
}
