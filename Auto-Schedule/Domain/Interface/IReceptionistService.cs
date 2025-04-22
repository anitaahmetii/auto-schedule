using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IReceptionistService
    {
        public Task<List<ReceptionistModel>> GetAll(CancellationToken cancellationToken);
        public Task<ReceptionistModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<ReceptionistModel> CreateOrUpdate(ReceptionistModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);
    }
}
