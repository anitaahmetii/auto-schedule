using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class CourseLecturesModel
    {
        public Guid? Id { get; set; }
        //public Guid LecturesId { get; set; }
        //public Lectures Lectures { get; set; }

        public Guid UserId { get; set; }

        public Guid CourseId { get; set; }
        
    }
}
