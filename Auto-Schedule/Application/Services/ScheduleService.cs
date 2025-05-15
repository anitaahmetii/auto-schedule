using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Interface;
using Domain.Model;
using ExcelDataReader;
using Infrastructure.Data;
using Infrastructure.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Data;

namespace Application.Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthorizationManager _authorizationManager;

        public ScheduleService(AppDbContext context, IMapper mapper, IAuthorizationManager authorizationManager)
        {
            _context = context;
            _mapper = mapper;
            _authorizationManager = authorizationManager;
        }
        public async Task<List<ScheduleModel>> ImportScheduleFromExcelAsync(IFormFile file)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            stream.Position = 0;

            using var reader = ExcelReaderFactory.CreateReader(stream);
            var result = reader.AsDataSet();
            var table = result.Tables[0];

            var scheduleList = new List<Schedule>();

            for (int row = 1; row < table.Rows.Count; row++)
            {
                var dto = new ScheduleModel
                {
                    Day = table.Rows[row][0]?.ToString()?.Trim(),
                    StartTime = table.Rows[row][1]?.ToString()?.Trim(),
                    EndTime = table.Rows[row][2]?.ToString()?.Trim(),
                    Halls = table.Rows[row][3].ToString()?.Trim(),
                    Location = table.Rows[row][4].ToString()?.Trim(),
                    Department = table.Rows[row][5]?.ToString()?.Trim(),
                    Group = table.Rows[row][6].ToString()?.Trim(),
                    CourseLecture = table.Rows[row][7]?.ToString()?.Trim()

                };
                var splitParts = dto.CourseLecture.Split(' ', 2); 

                if (splitParts.Length != 2)
                {
                    throw new Exception($"Formati i gabuar për CourseLecture: '{dto.CourseLecture}'");
                }

                var courseCode = splitParts[0];
                var userFullName = splitParts[1];

                var courseId = await _context.Courses
                    .Where(c => c.Name == courseCode)
                    .Select(c => c.Id)
                    .FirstOrDefaultAsync();

                if (courseId == Guid.Empty)
                {
                    throw new Exception($"Course me kodin '{courseCode}' nuk u gjet.");
                }

                var userId = await _context.Users
                    .Where(u => (u.UserName + " " + u.LastName) == userFullName)
                    .Select(u => u.Id)
                    .FirstOrDefaultAsync();

                if (userId == Guid.Empty)
                {
                    throw new Exception($"User me emrin '{userFullName}' nuk u gjet.");
                }

                
                var courseLecture = await _context.CourseLectures
                .Include(cl => cl.Course)
                .Include(cl => cl.User)
                .FirstOrDefaultAsync(cl => cl.CourseId == courseId && cl.UserId == userId);

                if (courseLecture == null)
                {
                    throw new Exception($"CourseLecture për '{courseCode} {userFullName}' nuk u gjet.");
                }

                var hallsId = await _context.Halls
                  .Where(d => d.Name == dto.Halls)
                  .Select(d => d.Id)
                  .FirstOrDefaultAsync();

                var locationId = await _context.Location
                  .Where(d => d.Name == dto.Location)
                  .Select(d => d.Id)
                  .FirstOrDefaultAsync();

                var departmentId = await _context.Departments
                    .Where(d => d.Code == dto.Department)
                    .Select(d => d.Id)
                    .FirstOrDefaultAsync();

                var groupId = await _context.Groups
                  .Where(d => d.Name == dto.Group)
                  .Select(d => d.Id)
                  .FirstOrDefaultAsync();
                var courseLectureId = courseLecture.Id;
                var schedule = new Schedule
                {
                    Id = Guid.NewGuid(),
                    Day = Enum.TryParse<Days>(dto.Day, true, out var parsedDay) ? parsedDay : throw new Exception($"Dita '{dto.Day}' nuk është valide."),
                    StartTime = dto.StartTime,
                    EndTime = dto.EndTime,
                    DepartmentId = departmentId,
                    Department = await _context.Departments.FindAsync(departmentId),
                    HallsId = hallsId,
                    Halls = await _context.Halls.FindAsync(hallsId),
                    LocationId = locationId,
                    Location = await _context.Location.FindAsync(locationId),
                    GroupId = groupId,
                    Group = await _context.Groups.FindAsync(groupId),
                    CourseLectureId = courseLectureId,
                    CourseLectures =courseLecture
                };

                scheduleList.Add(schedule);
            }

            await _context.Schedules.AddRangeAsync(scheduleList);
            await _context.SaveChangesAsync();

            var scheduleModels = _mapper.Map<List<ScheduleModel>>(scheduleList);
            return scheduleModels;
        }
      
        public async Task<List<ScheduleModel>> GetAll(CancellationToken cancellationToken)
        {
            var schedule = await _context.Schedules
                .Include(s => s.Department)
                .Include(x => x.Halls)
                .Include(x => x.Location)
                .Include(x => x.Group)
                .Include(x=>x.CourseLectures)
                .ThenInclude(x=>x.Course)
                .Include(x => x.CourseLectures)
                 .ThenInclude(x=>x.User)
                .ToListAsync(cancellationToken);

            var model = _mapper.Map<List<ScheduleModel>>(schedule);
            return model;
        }

        public async Task<ScheduleModel> UpdateAsync(ScheduleModel model, CancellationToken cancellationToken)
        {
            var existingSchedule = await _context.Schedules
                .FirstOrDefaultAsync(s => s.Id == model.Id, cancellationToken);

            if (existingSchedule == null)
                throw new Exception("Schedule not found");

            // Përditëso vlerat bazuar në modelin e ri
            if (Enum.TryParse<Days>(model.Day, true, out var parsedDay))
            {
                existingSchedule.Day = parsedDay;
            }
            else
            {
                throw new Exception($"Dita '{model.Day}' nuk është valide.");
            }

            existingSchedule.StartTime = model.StartTime;
            existingSchedule.EndTime = model.EndTime;

            // Merr ID për lidhjet me entitete të tjera
            existingSchedule.DepartmentId = await _context.Departments
                .Where(d => d.Code == model.Department)
                .Select(d => d.Id)
                .FirstOrDefaultAsync();

            existingSchedule.HallsId = await _context.Halls
                .Where(h => h.Name == model.Halls)
                .Select(h => h.Id)
                .FirstOrDefaultAsync();

            existingSchedule.LocationId = await _context.Location
                .Where(l => l.Name == model.Location)
                .Select(l => l.Id)
                .FirstOrDefaultAsync();

            existingSchedule.GroupId = await _context.Groups
                .Where(g => g.Name == model.Group)
                .Select(g => g.Id)
                .FirstOrDefaultAsync();
            var splitParts = model.CourseLecture.Split(' ', 2);
            var courseCode = splitParts[0];
            var userFullName = splitParts[1];
            var courseId = await _context.Courses
                   .Where(c => c.Name == courseCode)
                   .Select(c => c.Id)
                   .FirstOrDefaultAsync();//0196cacd-9aad-773d-aef9-918ef48570c1

            if (courseId == Guid.Empty)
            {
                throw new Exception($"Course me kodin '{courseCode}' nuk u gjet.");
            }


            var userId = await _context.Users
                .Where(u => (u.UserName + " " + u.LastName) == userFullName)
                .Select(u => u.Id)
                .FirstOrDefaultAsync();

            var courseLecture = await _context.CourseLectures
                .Include(cl => cl.Course)
                .Include(cl => cl.User)
                .FirstOrDefaultAsync(cl => cl.CourseId == courseId && cl.UserId == userId);
            existingSchedule.CourseLectureId = courseLecture.Id;


            _context.Schedules.Update(existingSchedule);
            await _context.SaveChangesAsync(cancellationToken);

            return await GetById(existingSchedule.Id, cancellationToken);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var schedule = await _context.Schedules.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();
        }

        public async Task<ScheduleModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var schedule = await _context.Schedules
                .Include(x => x.Department)
                .Include(x => x.Halls)
                .Include(x => x.Location)
                .Include(x => x.Group)
                .Include (x => x.CourseLectures)
                .ThenInclude(x => x.Course)
                .ThenInclude(x => x.User)
                .Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            var model = _mapper.Map<ScheduleModel>(schedule);

            return model;
        }
    }
}