using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Lectures:Staff
    {
        public string AcademicGrade { get; set; }
        public LectureType lectureType { get; set; }

        public Guid ScheduleTypeId { get; set; }
        public ScheduleType ScheduleType { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public ICollection<CourseLectures> CourseLectures { get; set; } = new List<CourseLectures>();
    }
}
