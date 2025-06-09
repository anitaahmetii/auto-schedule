using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class LecturerProfileModel
    {
        public Guid? Id { get; set; }
        public string PersonalID { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string LastName { get; set; }
        public DateOnly Birthdate { get; set; }
        public Guid CityId { get; set; }
        public string Address { get; set; }
        public string Gender { get; set; }
        public string PersonalEmail { get; set; }
        public string PhoneNumber { get; set; }
        public string AcademicGrade { get; set; }
        //public LectureType lectureType { get; set; }
        //public string? Password { get; set; }
    }
}
