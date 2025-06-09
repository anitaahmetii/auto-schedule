using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface ILecturerProfileService
    {
        Task<LecturerProfileModel> GetLecturerProfileAsync(Guid id, CancellationToken cancellationToken);
        Task<LecturerProfileModel> UpdateLecturerProfileAsync(LecturerProfileModel lecturerProfile, CancellationToken cancellationToken);
    }
}
