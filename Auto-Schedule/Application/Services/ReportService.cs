using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public ReportService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        // Funksioni për të marrë të gjithë përdoruesit
        public async Task<List<UserModel>> GetUsers(CancellationToken cancellationToken)
        {
            var users = await appDbContext.Users.ToListAsync(cancellationToken);
            return mapper.Map<List<UserModel>>(users);
        }

        public async Task<ReportModel> CreateOrUpdate(ReportModel model, CancellationToken cancellationToken)
        {
            Report report;

            if (model.Id == null || model.Id == Guid.Empty)
            {
                report = mapper.Map<Report>(model);
                report.Id = Guid.NewGuid();

                // Sigurohu që UserId është i vendosur kur krijohet një raport i ri
                if (model.UserId == Guid.Empty)
                {
                    throw new Exception("UserId cannot be empty");
                }

                await appDbContext.Reports.AddAsync(report, cancellationToken);
            }
            else
            {
                report = await appDbContext.Reports
                    .FirstOrDefaultAsync(x => x.Id == model.Id, cancellationToken);

                if (report == null)
                    throw new Exception("Report not found");

                mapper.Map(model, report); // përditëson automatikisht fushat
            }

            await appDbContext.SaveChangesAsync(cancellationToken);

            // Rikthe entity-n bashkë me User që të mbushet UserName
            var updatedReport = await appDbContext.Reports
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == report.Id, cancellationToken);

            return mapper.Map<ReportModel>(updatedReport);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var report = await appDbContext.Reports
                .FirstOrDefaultAsync(x => x.Id == Id, cancellationToken);

            if (report == null)
                throw new Exception("Report not found");

            appDbContext.Reports.Remove(report);
            await appDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<ReportModel>> GetAll(CancellationToken cancellationToken)
        {
            var reports = await appDbContext.Reports
                .Include(x => x.User)
                .ToListAsync(cancellationToken);

            return mapper.Map<List<ReportModel>>(reports);
        }

        public async Task<ReportModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var report = await appDbContext.Reports
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == Id, cancellationToken);

            if (report == null)
                throw new Exception("Report not found");

            return mapper.Map<ReportModel>(report);
        }
    }
}
