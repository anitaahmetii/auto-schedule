using Domain.Model;
using Microsoft.AspNetCore.Http;
namespace Domain.Interface
{
    public interface IScheduleService
    {
        Task<List<ScheduleModel>> ImportScheduleFromExcelAsync(IFormFile file);
        Task<List<ScheduleModel>> GetAll(CancellationToken cancellationToken);
        Task<ScheduleModel> GetById(Guid Id, CancellationToken cancellationToken);
        Task DeleteById(Guid Id, CancellationToken cancellationToken);
    }
}
