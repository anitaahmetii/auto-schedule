using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
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

            if( _context.Schedules.Any(s =>
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
    }
}
