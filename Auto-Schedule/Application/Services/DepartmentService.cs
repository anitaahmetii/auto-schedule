using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public DepartmentService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        public async Task<DepartmentModel> CreateOrUpdate(DepartmentModel model, CancellationToken cancellationToken)
        {
            Department department = new Department();
            if (model.Id == null)
            {
                await appDbContext.Departments.AddAsync(department);
            }
            else
            {
                department = await appDbContext.Departments.Where(x => x.Id == model.Id).FirstOrDefaultAsync(cancellationToken);
            }
            department.Name = model.Name;
            department.Code = model.Code;

            await appDbContext.SaveChangesAsync();

            return await GetById(department.Id, cancellationToken);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var department = await appDbContext.Departments.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            appDbContext.Departments.Remove(department);
            await appDbContext.SaveChangesAsync();
        }

        public async Task<List<DepartmentModel>> GetAll(CancellationToken cancellationToken)
        {
            var department = await appDbContext.Departments.ToListAsync(cancellationToken);

            var model = mapper.Map<List<DepartmentModel>>(department);

            return model;
        }

        public async Task<DepartmentModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var department = await appDbContext.Departments.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            var model = mapper.Map<DepartmentModel>(department);

            return model;
        }

        public async Task<List<ListItemModel>> GetDepartmentsSelectListAsync(CancellationToken cancellationToken)
        {
            var model = await appDbContext.Departments
                .Select(x => new ListItemModel()
                {
                    Id = x.Id,
                    Name = x.Code
                }).ToListAsync(cancellationToken);

            return model;

        }
        public async Task<List<DepartmentModel>> SearchDepartments(string searchParams)
        {
            var query = appDbContext.Departments.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchParams))
            {
                var lowerSearch = searchParams.ToLower();

                query = query.Where(d =>
                    d.Name.ToLower().Contains(lowerSearch) ||
                    d.Code.ToLower().Contains(lowerSearch));
            }

            var results = await query
                .Select(a => new DepartmentModel
                {
                    Id = a.Id,
                    Name = a.Name,
                    Code = a.Code
                })
                .ToListAsync();

            return results;
        }

    }
}
