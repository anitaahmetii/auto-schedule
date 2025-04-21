using AutoMapper;
using Domain.Entities;
using Domain.Model;
using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ReportService: IReportService
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

            if (model.Id == null || model.Id == Guid.Empty)
            {
                // Mapping nga model -> entity
                report = mapper.Map<Report>(model);
                report.Id = Guid.NewGuid(); // e vendos ID nëse është create

                await appDbContext.Reports.AddAsync(report, cancellationToken);
            }
            else
            {
                // merr entity-n ekzistues
                report = await appDbContext.Reports
                    .Where(x => x.Id == model.Id)
                    .FirstOrDefaultAsync(cancellationToken);

                if (report == null)
                    throw new Exception("Report not found");

                // përditëso të dhënat me mapper
                mapper.Map(model, report); // automatikisht i përditëson fushat që kanë emrat njëjtë
            }

            await appDbContext.SaveChangesAsync(cancellationToken);

            // kthe modelin e përditësuar
            return mapper.Map<ReportModel>(report);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var report = await appDbContext.Reports
                .Where(x => x.Id == Id)
                .FirstOrDefaultAsync(cancellationToken);

            appDbContext.Reports.Remove(report);
            await appDbContext.SaveChangesAsync();
        }

        public async Task<List<ReportModel>> GetAll(CancellationToken cancellationToken)
        {
            var report = await appDbContext.Reports.ToListAsync(cancellationToken);
            var model = mapper.Map<List<ReportModel>>(report);
            return model;
        }

        public async Task<ReportModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var report = await appDbContext.Reports
                .Where(x => x.Id == Id)
                .FirstOrDefaultAsync(cancellationToken);

            var model = mapper.Map<ReportModel>(report);
            return model;
        }
    }

}
