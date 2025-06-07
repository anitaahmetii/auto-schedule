using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IStudentProfileService
    {
        Task<StudentProfileModel> GetStudentProfileAsync(Guid Id, CancellationToken cancellationToken);
        Task<StudentProfileModel> UpdateStudentProfileAsync(StudentProfileModel studentProfile, CancellationToken cancellationToken);
    }
}
