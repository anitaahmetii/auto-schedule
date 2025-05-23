using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Student:User
    {
        public string AcademicProgram { get; set; }
        public string AcademicYear {  get; set; }
        public DateOnly Registred { get; set; }
        public Guid GroupId { get; set; }
        public Group Group { get; set; }

    }
}
