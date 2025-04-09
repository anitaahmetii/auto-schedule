using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CourseLectures
    {
        public Guid Id { get; set; }
        public Guid LecturesId { get; set; }
        public Lectures Lectures { get; set; }

        public Guid CourseId { get; set; }
        public Course Course { get; set; }
        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    }
}
