using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class CourseModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string ECTS { get; set; }
        public string Semester { get; set; }
        public bool IsLecture { get; set; }
        public bool IsExcercise { get; set; }
        public Guid? UserId { get; set; }
    }
}
