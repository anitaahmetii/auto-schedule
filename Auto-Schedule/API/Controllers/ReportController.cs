﻿using Application.Services;
using Domain.Interface;
using Domain.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService service;
        public ReportController(IReportService reportService)
        {
            this.service = reportService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var model = await service.GetAll(cancellationToken);
            return Ok(model);
        }
        
        [HttpGet("by-id/{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var model = await service.GetById(id, cancellationToken);

            return Ok(model);
        }
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate(ReportModel model, CancellationToken cancellationToken)
        {
            var report = await service.CreateOrUpdate(model, cancellationToken);

            return Ok(report);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(Guid id, CancellationToken cancellationToken)
        {
            await service.DeleteById(id, cancellationToken);
            return Ok();
        }

        [HttpGet("schedule/{scheduleId}")]
        public async Task<IActionResult> GetByScheduleId(Guid scheduleId, CancellationToken cancellationToken)
        {
            var report = await service.GetByScheduleIdAsync(scheduleId, cancellationToken);

            if (report == null)
                return NotFound("No report found for this schedule ID.");

            return Ok(report);
        }

        [HttpPost("generate-pdf")]
        public IActionResult GeneratePdf([FromBody] ReportModel report)
        {
            if (report == null)
                return BadRequest("Report data is required.");

            var pdfBytes = service.GenerateReportPdf(report);

            var fileName = $"Raport_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";

            return File(pdfBytes, "application/pdf", fileName);
        }
    }
}

