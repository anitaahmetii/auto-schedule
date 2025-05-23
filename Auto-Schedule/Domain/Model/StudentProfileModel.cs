using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class StudentProfileModel 
    {
        public Guid? Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; } 
        public string LastName { get; set; }
        //public string Birthdate { get; set; }
        //public string Birthplace { get; set; }
        //public string Gender { get; set; }
        //public string PhoneNumber { get; set; }
        public string AcademicProgram { get; set; }
        //public string Department { get; set; }
        public Guid? GroupId { get; set; }
    }
}
