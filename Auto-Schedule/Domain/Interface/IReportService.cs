using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IReportService
    {
        public Task<List<ReportModel>> GetAll(CancellationToken cancellationToken);
        public Task<ReportModel> GetById(Guid Id, CancellationToken cancellationToken);
        public Task<ReportModel> CreateOrUpdate(ReportModel model, CancellationToken cancellationToken);
        public Task DeleteById(Guid Id, CancellationToken cancellationToken);
        Task<ReportModel> GetByScheduleIdAsync(Guid scheduleId, CancellationToken cancellationToken);
        public byte[] GenerateReportPdf(ReportModel report);

    }
}
