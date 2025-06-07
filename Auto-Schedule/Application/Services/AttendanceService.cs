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
    public class AttendanceService : IAttendanceService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public AttendanceService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> ConfirmPresenceAsync(Guid studentId, Guid scheduleId, string code, CancellationToken cancellationToken)
        {
            var student = await _context.Users.FirstOrDefaultAsync(x => x.Id == studentId, cancellationToken);
            if (student == null) return false;

            var now = DateTime.UtcNow;
            var attendanceCode = await _context.AttendanceCodePeriods
                .FirstOrDefaultAsync(x =>
                x.ScheduleId == scheduleId &&
                x.Code.ToLower() == code.ToLower() &&
                x.StartDateTime <= now &&
                x.EndDateTime >= now, cancellationToken);

            if (attendanceCode == null) return false;

            var alreadyConfirmed = await _context.Attendances
                .AnyAsync(a => a.StudentId == studentId && a.ScheduleId == scheduleId, cancellationToken);

            if (alreadyConfirmed) return false;

            var attendance = new Attendance
            {
                Id = Guid.NewGuid(),
                StudentId = studentId,
                ScheduleId = scheduleId,
                ConfirmationTime = now
            };

            await _context.Attendances.AddAsync(attendance, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
        public async Task<List<AttendanceModel>> GetAttendancesAsync(Guid studentId, CancellationToken cancellationToken)
        {
            var attendances = await _context.Attendances
                .Where(x => x.StudentId == studentId)
                .ToListAsync(cancellationToken);
            return _mapper.Map<List<AttendanceModel>>(attendances);
        }
        public async Task<List<AttendanceModel>> GetStudentAttendancesAsync(Guid lectureId, CancellationToken cancellationToken)
        {
            var attendances = await _context.Attendances
                 .Where(x => x.Schedule.CourseLectures.UserId == lectureId)
                 .Select(x => new AttendanceModel
                 {
                     Id = x.Id,
                     StudentId = x.StudentId,
                     ScheduleId = x.ScheduleId,
                     ConfirmationTime = x.ConfirmationTime
                 })
                 .ToListAsync();
            return _mapper.Map<List<AttendanceModel>>(attendances);
        }
    }
}
