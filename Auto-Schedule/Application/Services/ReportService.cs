using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading;
using System.Threading.Tasks;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

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

        public async Task<ReportModel> GetByScheduleIdAsync(Guid scheduleId, CancellationToken cancellationToken)
        {
            var report = await appDbContext.Reports
                .Where(x => x.ScheduleId == scheduleId)
                .FirstOrDefaultAsync(cancellationToken);

            if (report == null) return null;

            return new ReportModel
            {
                Id = report.Id,
                Absence = report.Absence,
                Comment = report.Comment,
                DateTime = report.DateTime,
                UserId = report.UserId,
                ScheduleId = report.ScheduleId
            };
        }


        public byte[] GenerateReportPdf(ReportModel report)
        {
            try
            {
                var document = QuestPDF.Fluent.Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(2, Unit.Centimetre);

                        // Header me titull dhe vijë nënvizuese
                        page.Header()
                            .Column(column =>
                            {
                                column.Item().Text("Raporti")
                                    .SemiBold().FontSize(24).FontColor(Colors.Blue.Darken1);
                                column.Item().LineHorizontal(1).LineColor(Colors.Blue.Lighten3);
                            });

                        page.Content()
                            .PaddingVertical(10)
                            .Column(column =>
                            {
                                column.Spacing(20);

                                // Seksioni i Komentit me kuti rreth tij
                                column.Item()
                                    .Text("Koment")
                                    .Bold()
                                    .FontSize(14)
                                    .FontColor(Colors.Grey.Darken2);

                                column.Item()
                                    .Padding(10)
                                    .Border(1)
                                    .BorderColor(Colors.Grey.Lighten2)
                                    .Background(Colors.Grey.Lighten5)
                                    .MinHeight(80)  // hapsirë minimale për koment, mund ta rregullosh
                                    .Text(report.Comment ?? "—")
                                    .FontSize(12)
                                    .FontColor(Colors.Grey.Darken3);

                                // Absenca
                                column.Item().Text("Absencë")
                                    .Bold()
                                    .FontSize(14)
                                    .FontColor(Colors.Grey.Darken2);
                                column.Item().Text(report.Absence.ToString())
                                    .FontSize(12);

                                // Data
                                var formattedDate = report.DateTime != DateTime.MinValue ? report.DateTime.ToString("dd.MM.yyyy HH:mm") : "Data e papërcaktuar";
                                column.Item().Text("Data")
                                    .Bold()
                                    .FontSize(14)
                                    .FontColor(Colors.Grey.Darken2);
                                column.Item().Text(formattedDate)
                                    .FontSize(12);
                            });

                        // Footer me numër faqesh në qendër
                        page.Footer()
                            .AlignCenter()
                            .Text(text =>
                            {
                                text.Span("Faqja ").FontSize(10).FontColor(Colors.Grey.Lighten2);
                                text.CurrentPageNumber().FontSize(10).FontColor(Colors.Grey.Lighten2);
                                text.Span(" nga ").FontSize(10).FontColor(Colors.Grey.Lighten2);
                                text.TotalPages().FontSize(10).FontColor(Colors.Grey.Lighten2);
                            });
                    });
                });

                return document.GeneratePdf();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Gabim gjatë gjenerimit të PDF: " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }




    }
}
