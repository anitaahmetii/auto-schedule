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
    public class AttendanceCodePeriodService : IAttendanceCodePeriodService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public AttendanceCodePeriodService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<string?> CreateAttendanceCodePeriodAsync(Guid scheduleId, CancellationToken cancellationToken)
        {
            var code = GenerateRandomCode(6);
            var now = DateTime.UtcNow;
            var exists = await _context.AttendanceCodePeriods.FirstOrDefaultAsync(c => c.ScheduleId == scheduleId, cancellationToken);
            if (exists != null)
            {
                //if ((now < exists.StartDateTime).mINS)
                return "";
            }
            var attendanceCodePeriod = new AttendanceCodePeriod
            {
                Id = Guid.NewGuid(),
                Code = code,
                StartDateTime = now,
                EndDateTime = now.AddMinutes(5),
                ScheduleId = scheduleId
            };
            await _context.AttendanceCodePeriods.AddAsync(attendanceCodePeriod, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            var createdCode = _mapper.Map<AttendanceCodePeriodModel>(attendanceCodePeriod);
            return createdCode.Code;
        }
        public async Task<List<AttendanceCodePeriodModel>> GetAttendanceCodeAsync(CancellationToken cancellationToken)
        {
            var code = await _context.AttendanceCodePeriods.ToListAsync(cancellationToken);
            return _mapper.Map<List<AttendanceCodePeriodModel>>(code);
        }
        public async Task<string?> DeleteAttendanceCodePeriodAsync(Guid scheduleId, CancellationToken cancellationToken)
        {
            var code = await _context.AttendanceCodePeriods.FirstOrDefaultAsync(c => c.ScheduleId == scheduleId);
            if (code == null) return null;
            _context.AttendanceCodePeriods.Remove(code!);
            await _context.SaveChangesAsync(cancellationToken);
            return code.Code!;
        }
        //public async Task<Boolean> ConfirmPresenceAsync(Guid studentId, Guid scheduleId, CancellationToken cancellationToken)
        //{

        //}
        private string GenerateRandomCode(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Range(0, length)
                .Select(_ => chars[random.Next(chars.Length)])
                .ToArray());
        }
    }
}
