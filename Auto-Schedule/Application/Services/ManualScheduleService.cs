using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Domain.Enum;
using Domain.Interface;
using Domain.Model;
using ExcelDataReader;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ManualScheduleService : IManualScheduleService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public ManualScheduleService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ManualScheduleModel> CreateManualScheduleAsync(ManualScheduleModel manualSchedule, CancellationToken cancellationToken)
        {
            try
            {
                ValidateManualScheduleModel(manualSchedule);
                var schedule = _mapper.Map<Schedule>(manualSchedule);
                await _context.Schedules.AddAsync(schedule, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                return manualSchedule;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("An error occurred while saving the schedule to the database.", dbEx);
            }
            catch (ArgumentException argEx)
            {
                Console.WriteLine("Invalid Argument(s): " + argEx.ToString());
                throw;
            }
            catch (Exception ex)
            {
                var detailedError = ex.InnerException?.InnerException?.Message
                         ?? ex.InnerException?.Message
                         ?? ex.Message;

                throw new Exception($"A database error occurred while creating the schedule. {detailedError}");
            }
        }
        public async Task<List<ManualScheduleModel>> GetAllManualSchedulesAsync(CancellationToken cancellationToken)
        {
            try
            {
                var schedules = await _context.Schedules.ToListAsync(cancellationToken);
                if (schedules == null)
                {
                    throw new Exception("No schedule found!");
                }
                return _mapper.Map<List<ManualScheduleModel>>(schedules);
            }
            catch (OperationCanceledException ex)
            {
                throw new OperationCanceledException("The operation was cancelled.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the schedule.", ex);
            }
        }
        public async Task<ManualScheduleModel> GetByIdManualScheduleAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var scheduleId = await _context.Schedules.FirstOrDefaultAsync(x => x.Id == Id, cancellationToken);
                if (scheduleId == null)
                {
                    throw new Exception("Schedule not found!");
                }
                return _mapper.Map<ManualScheduleModel>(scheduleId);
            }
            catch (OperationCanceledException ex)
            {
                throw new OperationCanceledException("The operation was cancelled.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the schedule.", ex);
            }
        }
        public async Task<ManualScheduleModel> UpdateManualScheduleAsync(ManualScheduleModel manualSchedule, CancellationToken cancellationToken)
        {
            try
            {
                ValidateManualScheduleModel(manualSchedule);
                var schedule = await _context.Schedules.FindAsync(manualSchedule.Id);
                if (schedule == null)
                {
                    throw new Exception("Schedule not found!");
                }
                _mapper.Map(manualSchedule, schedule);
                await _context.SaveChangesAsync(cancellationToken);
                return manualSchedule;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new DbUpdateConcurrencyException("A concurrency error occurred while updating the schedule.", ex);
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException("A database error occurred while updating the schedule.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the schedule.", ex);
            }
        }
        public async Task<ManualScheduleModel> DeleteManualScheduleAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var scheduleId = await _context.Schedules.FirstOrDefaultAsync(x => x.Id == Id);
                if (scheduleId == null)
                {
                    throw new Exception("No schedule found to be deleted!");
                }
                _context.Schedules.Remove(scheduleId);
                await _context.SaveChangesAsync(cancellationToken);
                return _mapper.Map<ManualScheduleModel>(scheduleId);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new DbUpdateConcurrencyException("A concurrency error occurred while deleting the schedule.", ex);
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException("A database error occurred while deleting the schedule.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the schedule.", ex);
            }
        }
        public async Task<List<ImportScheduleModel>> ImportScheduleFromExcelAsync(IFormFile file)
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
                var dto = new ImportScheduleModel
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
                    CourseLecturesId = courseLectureId,
                    CourseLectures = courseLecture
                };

                scheduleList.Add(schedule);
            }

            await _context.Schedules.AddRangeAsync(scheduleList);
            await _context.SaveChangesAsync();

            var scheduleModels = _mapper.Map<List<ImportScheduleModel>>(scheduleList);
            return scheduleModels;
        }
        public async Task<IReadOnlyList<ManualScheduleModel>> GetGroupScheduleAsync(Guid groupId, CancellationToken cancellationToken)
        {
            var schedules = await _context.Schedules
                .Where(x => x.GroupId == groupId)
                .ProjectTo<ManualScheduleModel>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
            return (!schedules.Any()) ? throw new KeyNotFoundException($"Group {groupId} has no schedules.") : schedules;
        }
        private void ValidateManualScheduleModel(ManualScheduleModel manualSchedule)
        {
            if (manualSchedule == null)
                throw new ArgumentNullException(nameof(manualSchedule), "The schedule model cannot be null.");

            if (!Enum.TryParse<Days>(manualSchedule.Day, out Days dayEnum))
            {
                throw new ArgumentException("Invalid day value.", nameof(manualSchedule.Day));
            }

            if (string.IsNullOrWhiteSpace(manualSchedule.StartTime))
                throw new ArgumentException("The start time is required.", nameof(manualSchedule.StartTime));

            if (string.IsNullOrWhiteSpace(manualSchedule.EndTime))
                throw new ArgumentException("The end time is required.", nameof(manualSchedule.EndTime));

            if (manualSchedule.CourseLecturesId == Guid.Empty)
                throw new ArgumentException("CourseLecturesID is required.");

            if (manualSchedule.HallsId == Guid.Empty)
                throw new ArgumentException("HallsID is required.");

            if (manualSchedule.LocationId == Guid.Empty)
                throw new ArgumentException("LocationID is required.");

            if (manualSchedule.DepartmentId == Guid.Empty)
                throw new ArgumentException("DepartmentID is required.");

            if (manualSchedule.GroupId == Guid.Empty)
                throw new ArgumentException("GroupID is required.");

            if (_context.Schedules.Any(s =>
                s.Day == dayEnum &&
                s.StartTime.Equals(manualSchedule.StartTime) &&
                s.EndTime.Equals(manualSchedule.EndTime) &&
                s.CourseLecturesId == manualSchedule.CourseLecturesId &&
                s.HallsId == manualSchedule.HallsId &&
                s.LocationId == manualSchedule.LocationId &&
                s.DepartmentId == manualSchedule.DepartmentId &&
                s.GroupId == manualSchedule.GroupId))
            {
                throw new InvalidOperationException("This schedule already exists!");
            }
        }
        public async Task<List<ManualScheduleModel>> SelectGroupByStudent(Guid studentId, Guid groupId, CancellationToken cancellationToken)
        {
            var student = await _context.Users
                .OfType<Student>()
                .FirstOrDefaultAsync(s => s.Id == studentId, cancellationToken)
                  ?? throw new Exception("Student does not exist!");

            var group = await _context.Groups
                .Include(g => g.Schedules)
                    .ThenInclude(s => s.CourseLectures)
                .Include(g => g.Schedules)
                    .ThenInclude(s => s.Halls)
                .Include(g => g.Schedules)
                    .ThenInclude(s => s.Location)
                .FirstOrDefaultAsync(g => g.Id == groupId, cancellationToken)
                ?? throw new Exception("Group does not exist!");

            if (await IsGroupFullAsync(student.DepartmentId, groupId))
            {
                throw new Exception("Group is full. Cannot add more students.");
            }

            student.GroupId = group.Id;
            await _context.SaveChangesAsync(cancellationToken);

            var groupSchedule = _mapper.Map<List<ManualScheduleModel>>(group.Schedules);
            return groupSchedule;
        }
        public async Task<bool> IsGroupFullAsync(Guid departmentId, Guid groupId)
        {
            var capacity = await _context.Groups
                                    .Where(g => g.Id == groupId)
                                    .Select(g => g.Capacity)
                                    .FirstOrDefaultAsync();
            var numb =  await _context.Users
                                .OfType<Student>()
                                .CountAsync(g => g.GroupId == groupId && g.DepartmentId == departmentId);
            return capacity <= numb;
        }
    }
}