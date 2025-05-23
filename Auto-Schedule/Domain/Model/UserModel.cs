using Domain.Enum;
namespace Domain.Model
{
    public class UserModel
    {
        public Guid? Id { get; set; }
        public string Email { get; set; } = default!;
        public string UserName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string PersonalID { get; set; } = default!;
        public string PersonalEmail { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public string? Password { get; set; } = default!;
        public DateOnly Birthdate { get; set; } = default!;
        public Guid CityId { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string Gender { get; set; } = default!;
        public Role? Role { get; set; } = default!;


        // Staff shared properties (Coordinator, Lecture, Receptionist)
        public string? StaffStatus { get; set; }

        // Coordinator-specific
        public string? CoordinatorResponsibilities { get; set; }

        // Receptionist-specific
        public string? ReceptionistResponsibilities { get; set; }

        // Lecture-specific
        public string? AcademicGrade { get; set; }
        public LectureType? LectureType { get; set; }
        public Guid? ScheduleTypeId { get; set; }

        // Student-specific
        public string? AcademicProgram { get; set; }
        public string? AcademicYear { get; set; }
        public DateOnly Registred { get; set; }
        public Guid? GroupId { get; set; }
    }
}
