using Domain.Entities;
using Domain.Enum;
using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface ILecturesService
    {
        public Task<List<LecturesModel>> GetAll(CancellationToken cancellationToken);
        public Task<LecturesModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<LecturesModel> CreateOrUpdate(LecturesModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);

        

    }
}
