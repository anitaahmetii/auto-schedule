using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Interface;
using Domain.Model;
using ExcelDataReader;
using Infrastructure.Data;
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

        public ScheduleService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //public async Task<List<ScheduleModel>> ImportScheduleFromExcelAsync(IFormFile file)
        //{
        //    // Aktivizo këtë për të lexuar Excel në MemoryStream
        //    System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        //    using var stream = new MemoryStream();
        //    await file.CopyToAsync(stream);
        //    stream.Position = 0;

        //    using var reader = ExcelReaderFactory.CreateReader(stream);
        //    var result = reader.AsDataSet();

        //    // Marrja e fletës e parë
        //    var table = result.Tables[0];

        //    var scheduleList = new List<Schedule>();

        // Fillon nga rreshti i dytë, pasi rreshti i parë është zakonisht për emrat e kolonave
        //for (int row = 1; row < table.Rows.Count; row++)
        //{
        //    var dto = new ScheduleModel
        //    {
        //        Day = table.Rows[row][0].ToString(),
        //        StartTime = table.Rows[row][1].ToString(),
        //        EndTime = table.Rows[row][2].ToString(),
        //        Department = table.Rows[row][3].ToString(),
        //Hall = table.Rows[row][4].ToString(),
        //Group = table.Rows[row][5].ToString(),
        //CourseLecture = table.Rows[row][7].ToString(),
        //Location = table.Rows[row][8].ToString()
        // };

        //var schedule = new Schedule
        //{
        //    Id = Guid.NewGuid(),
        //    Day = Enum.Parse<Days>(dto.Day, true),
        //    StartTime = dto.StartTime,
        //    EndTime = dto.EndTime,
        //    DepartmentId = await _context.Departments
        //        .Where(d => d.Code == dto.Department)
        //        .Select(d => d.Id).FirstOrDefaultAsync(),

        //HallsId = await _context.Halls
        //    .Where(h => h.Code == dto.Hall)
        //    .Select(h => h.Id).FirstOrDefaultAsync(),

        //GroupId = await _context.Groups
        //    .Where(g => g.Code == dto.Group)
        //    .Select(g => g.Id).FirstOrDefaultAsync(),

        //CourseLectureId = await _context.CourseLectures
        //    .Where(c => c.Name == dto.CourseLecture)
        //    .Select(c => c.Id).FirstOrDefaultAsync(),

        //LocationId = await _context.Location
        //    .Where(l => l.Name == dto.Location)
        //    .Select(l => l.Id).FirstOrDefaultAsync(),
        //    };

        //    scheduleList.Add(schedule);
        //}

        // Përdorim AddRangeAsync për të shtuar të dhënat në database
        //await _context.Schedules.AddRangeAsync(scheduleList);
        //await _context.SaveChangesAsync();
        //var scheduleModels = _mapper.Map<List<ScheduleModel>>(scheduleList);
        //return scheduleModels;
        //}
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
                    Department = table.Rows[row][3]?.ToString()?.Trim(),
                    Hall = table.Rows[row][4].ToString()?.Trim(),
                    Location = table.Rows[row][4].ToString()?.Trim(),
                    Group = table.Rows[row][4].ToString()?.Trim(),

                };

                // Merr ID e Departamentit nga kodi
                var departmentId = await _context.Departments
                    .Where(d => d.Code == dto.Department)
                    .Select(d => d.Id)
                    .FirstOrDefaultAsync();

                var hallId = await _context.Halls
                  .Where(d => d.Name == dto.Department)
                  .Select(d => d.Id)
                  .FirstOrDefaultAsync();

                var locationId = await _context.Location
                  .Where(d => d.Name == dto.Department)
                  .Select(d => d.Id)
                  .FirstOrDefaultAsync();

                var groupId = await _context.Groups
                  .Where(d => d.Name == dto.Department)
                  .Select(d => d.Id)
                  .FirstOrDefaultAsync();

                var schedule = new Schedule
                {
                    Id = Guid.NewGuid(),
                    Day = Enum.TryParse<Days>(dto.Day, true, out var parsedDay) ? parsedDay : throw new Exception($"Dita '{dto.Day}' nuk është valide."),
                    StartTime = dto.StartTime,
                    EndTime = dto.EndTime,
                    DepartmentId = departmentId,
                    HallId = hallId,
                    LocationId = locationId,
                    GroupId = groupId,
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
                .Include(x=>x.Halls)
                .Include(x=>x.Location)
                .Include(x=>x.Group)
                .ToListAsync(cancellationToken);

            var model = _mapper.Map<List<ScheduleModel>>(schedule);
            return model;
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
                .Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            var model = _mapper.Map<ScheduleModel>(schedule);

            return model;
        }
    }
}