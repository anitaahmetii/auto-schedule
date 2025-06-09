using Domain.Model;
using Microsoft.AspNetCore.Mvc;

namespace Domain.Interface
{
    public interface IDepartmentService
    {
        public Task<List<DepartmentModel>> GetAll(CancellationToken cancellationToken);
        public Task<DepartmentModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<DepartmentModel> CreateOrUpdate(DepartmentModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);
        public Task<List<ListItemModel>> GetDepartmentsSelectListAsync(CancellationToken cancellationToken);
        public Task<List<DepartmentModel>> SearchDepartments(string? searchTerm, string? sortBy, string? searchField);
        public Task<List<DepartmentStudentCountModel>> GetDepartmentsWithStudentCount(CancellationToken cancellationToken);
    }
}
