﻿using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;
        private readonly IAuthorizationManager _authorizationManager;

        public DepartmentService(AppDbContext appDbContext, IMapper mapper, IAuthorizationManager authorizationManager)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
            _authorizationManager = authorizationManager;
        }

        public async Task<DepartmentModel> CreateOrUpdate(DepartmentModel model, CancellationToken cancellationToken)
        {
            Guid? userId = _authorizationManager.GetUserId();
            if (userId is null)
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }
            Department department = new Department();
            if (model.Id == null)
            {
                department.UserId = userId ?? Guid.Empty;
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
            var department = await appDbContext.Departments.Include(x => x.User).ToListAsync(cancellationToken);

            var model = mapper.Map<List<DepartmentModel>>(department);

            return model;
        }

        public async Task<DepartmentModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var department = await appDbContext.Departments.Include(x=>x.User).Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

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
        public async Task<List<DepartmentModel>> SearchDepartments(string? searchTerm, string? sortBy, string? searchField)
        {
            var query = appDbContext.Departments.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lower = searchTerm.ToLower();

                query = searchField switch
                {
                    "name" => query.Where(d => d.Name.ToLower().Contains(lower)),
                    "code" => query.Where(d => d.Code.ToLower().Contains(lower)),
                    _ => query.Where(d => d.Name.ToLower().Contains(lower) || d.Code.ToLower().Contains(lower))
                };
            }

            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                query = sortBy switch
                {
                    "name_asc" => query.OrderBy(d => d.Name),
                    "name_desc" => query.OrderByDescending(d => d.Name),
                    "code_asc" => query.OrderBy(d => d.Code),
                    "code_desc" => query.OrderByDescending(d => d.Code),
                    _ => query
                };
            }

            return await query
                .Select(d => new DepartmentModel
                {
                    Id = d.Id,
                    Name = d.Name,
                    Code = d.Code
                })
                .ToListAsync();
        }
        public async Task<List<DepartmentStudentCountModel>> GetDepartmentsWithStudentCount(CancellationToken cancellationToken)
        {
            var result = await appDbContext.Departments
                .Select(d => new DepartmentStudentCountModel
                {
                    DepartmentName = d.Name,
                    StudentCount = d.Students.Count
                })
                .ToListAsync(cancellationToken);

            return result;
        }



    }
}
