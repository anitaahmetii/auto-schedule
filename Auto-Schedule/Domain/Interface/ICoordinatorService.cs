using Domain.Model;

namespace Domain.Interface
{
    public interface ICoordinatorService
    {
        public Task<List<CoordinatorModel>> GetAll(CancellationToken cancellationToken);
        public Task<CoordinatorModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<CoordinatorModel> CreateOrUpdate(CoordinatorModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);
    }
}
