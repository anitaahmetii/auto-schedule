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
                //ValidateManualScheduleModel(manualSchedule);
                var schedule = _mapper.Map<Schedule>(manualSchedule);
                await _context.Schedules.AddAsync(schedule, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                return manualSchedule;
            }
            //catch (DbUpdateException dbEx)
            //{
            //    throw new Exception("An error occurred while saving the schedule to the database.", dbEx);
            //}
            catch (DbUpdateException dbEx)
            {
                var errorDetails = dbEx.InnerException?.Message ?? dbEx.Message;

                var detailedMessage = "Ndodhi një gabim gjatë ruajtjes së orarit në databazë. "
                                    + "Ju lutem kontrolloni të dhënat dhe provoni përsëri.\n"
                                    + $"Detajet teknike: {errorDetails}";

                throw new Exception(detailedMessage, dbEx);
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
        private void ValidateManualScheduleModel(ManualScheduleModel manualSchedule)
        {
            if (manualSchedule == null)
                throw new ArgumentNullException(nameof(manualSchedule), "The schedule model cannot be null.");

            if (!Enum.IsDefined(typeof(Days), manualSchedule.Day))
                throw new ArgumentException("The day is invalid or not defined.", nameof(manualSchedule.Day));

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

            //bool exists = _context.Schedules.Any(s =>
            //    s.Day.Equals(manualSchedule.Day) &&
            //    s.StartTime.Equals(manualSchedule.StartTime) &&
            //    s.EndTime.Equals(manualSchedule.EndTime) &&
            //    s.CourseLectureId == manualSchedule.CourseLectureId &&
            //    s.Halls.Id == manualSchedule.HallsId &&
            //    s.Location.Id == manualSchedule.LocationId &&
            //    s.Department.Id == manualSchedule.DepartmentId &&
            //    s.Group.Id == manualSchedule.GroupId);

            //if (exists)
            //{
            //    throw new InvalidOperationException("This schedule already exists!");
            //}
        }
    }
}
