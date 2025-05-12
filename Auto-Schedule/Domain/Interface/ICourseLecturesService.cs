using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface ICourseLecturesService
    {
        public Task<List<CourseLecturesModel>> GetAll(CancellationToken cancellationToken);
        public Task<CourseLecturesModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<CourseLecturesModel> CreateOrUpdate(CourseLecturesModel model, CancellationToken cancellationToken);
        public Task<CourseLecturesModel> DeleteById(Guid Id, CancellationToken cancellationToken);
    }
}
