using Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Schedule
    {
        public Guid Id { get; set; }
        public Days Day { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public Guid CourseLecturesId { get; set; }
        public CourseLectures CourseLectures { get; set; }

        public Guid HallsId { get; set; }
        public Halls Halls { get; set; }
        public Guid LocationId { get; set; }
        public Location Location { get; set; }
        public Guid DepartmentId { get; set; }
        public Department Department { get; set; }

        public Guid GroupId { get;set ; }
        public Group Group { get; set; }

        //public Guid UserId { get; set; }
        //public User User { get; set; }
        public ICollection<AttendanceCodePeriod> AttendanceCodePeriods { get; set; } = new List<AttendanceCodePeriod>();
        public ICollection<Attendance> Attendances { get; set; }

        public bool HasReport { get; set; }
        public bool IsCanceled { get; set; } = false;

        public ICollection<Report> Reports { get; set; } = new List<Report>();

    }
}
