using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface ICourseService
    {
        Task<CourseModel> CreateCourseAsync(CourseModel courseModel, CancellationToken cancellationToken);
        Task<CourseModel> GetByIdCourseAsync(Guid Id, CancellationToken cancellationToken);
        Task<CourseModel> UpdateCourseAsync(CourseModel courseModel, CancellationToken cancellationToken);
        Task<List<CourseModel>> GetAllCoursesAsync(CancellationToken cancellationToken);
        Task<CourseModel> DeleteCourseAsync(Guid Id, CancellationToken cancellationToken);
    }
}
