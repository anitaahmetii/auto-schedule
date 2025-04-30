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

        public async Task<ReportModel> CreateOrUpdate(ReportModel model, CancellationToken cancellationToken)
        {
            Report report = new Report();

            if (model.Id == null)
            {
                await appDbContext.Reports.AddAsync(report, cancellationToken);
            }
            else
            {
                report = await appDbContext.Reports
                    .Where(x => x.Id == model.Id)
                    .FirstOrDefaultAsync(cancellationToken);
            }

            // Trajtimi i 'ScheduleId' që mund të jetë null
            report.Absence = model.Absence;
            report.Comment = model.Comment;
            report.DateTime = DateTime.SpecifyKind(model.DateTime, DateTimeKind.Utc);
            report.UserId = model.UserId;

            // Përdorim Guid.Empty nëse ScheduleId është null
            report.ScheduleId = model.ScheduleId ?? Guid.Empty;

            await appDbContext.SaveChangesAsync(cancellationToken);

            return await GetById(report.Id, cancellationToken);
        }

        public async Task DeleteById(Guid id, CancellationToken cancellationToken)
        {
            var report = await appDbContext.Reports
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync(cancellationToken);

            appDbContext.Reports.Remove(report);
            await appDbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<ReportModel>> GetAll(CancellationToken cancellationToken)
        {
            var reports = await appDbContext.Reports
                .ToListAsync(cancellationToken);

            var model = mapper.Map<List<ReportModel>>(reports);

            return model;
        }

        public async Task<ReportModel> GetById(Guid id, CancellationToken cancellationToken)
        {
            var report = await appDbContext.Reports
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync(cancellationToken);

            var model = mapper.Map<ReportModel>(report);

            return model;
        }
    }
}
