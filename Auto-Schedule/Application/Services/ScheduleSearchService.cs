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
using System.Threading.Tasks;

namespace Application.Services
{
    public class ScheduleSearchService: IScheduleSearchService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public ScheduleSearchService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<List<ManualScheduleModel>> GetSchedulesByFilter(ScheduleSearchModel model, CancellationToken cancellationToken)
        {
            var query = _context.Schedules
                .Include(s => s.CourseLectures)
                    .ThenInclude(cl => cl.User)
                .Include(s => s.CourseLectures)
                    .ThenInclude(cl => cl.Course)
                .Include(s => s.Halls)
                .Include(s => s.Group)
                .Include(s => s.Location)
                .Include(s => s.Department)
                .AsQueryable();

            if (!string.IsNullOrEmpty(model.Day) &&
                Enum.TryParse<Days>(model.Day, true, out var dayEnum))
            {
                query = query.Where(s => s.Day == dayEnum);
            }

            if (!string.IsNullOrEmpty(model.StartTime) && !string.IsNullOrEmpty(model.EndTime))
            {
                query = query.Where(s => String.Compare(s.StartTime, model.StartTime) >= 0 && String.Compare(s.EndTime, model.EndTime) <= 0);
            }
            else if (!string.IsNullOrEmpty(model.StartTime))
            {
                query = query.Where(s => s.StartTime == model.StartTime);
            }
            else if (!string.IsNullOrEmpty(model.EndTime))
            {
                query = query.Where(s => s.EndTime == model.EndTime);
            }

            if (model.CourseLecturesId?.Any() == true)
            {
                query = query.Where(s => model.CourseLecturesId.Contains(s.CourseLecturesId));
            }

            if (model.HallsId?.Any() == true)
            {
                query = query.Where(s => model.HallsId.Contains(s.HallsId));
            }

            if (model.LocationId?.Any() == true)
            {
                query = query.Where(s => model.LocationId.Contains(s.LocationId));
            }

            if (model.DepartmentId?.Any() == true)
            {
                query = query.Where(s => model.DepartmentId.Contains(s.DepartmentId));
            }

            if (model.GroupId?.Any() == true)
            {
                query = query.Where(s => model.GroupId.Contains(s.GroupId));
            }

            if (!string.IsNullOrWhiteSpace(model.SearchText))
            {
                var searchWords = model.SearchText.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);

                foreach (var word in searchWords)
                {
                    query = query.Where(s =>
                        (s.CourseLectures != null &&
                         s.CourseLectures.User != null &&
                         s.CourseLectures.Course != null &&
                         (
                            (s.CourseLectures.User.UserName != null && s.CourseLectures.User.UserName.ToLower().Contains(word)) ||
                            (s.CourseLectures.User.LastName != null && s.CourseLectures.User.LastName.ToLower().Contains(word)) ||
                            (s.CourseLectures.Course.Name != null && s.CourseLectures.Course.Name.ToLower().Contains(word))
                         )) ||
                        (s.Halls != null && s.Halls.Name != null && s.Halls.Name.ToLower().Contains(word)) ||
                        (s.Group != null && s.Group.Name != null && s.Group.Name.ToLower().Contains(word)) ||
                        (s.Location != null && s.Location.Name != null && s.Location.Name.ToLower().Contains(word)) ||
                        (s.Department != null && s.Department.Code != null && s.Department.Code.ToLower().Contains(word)) ||
                        (!string.IsNullOrEmpty(s.StartTime) && s.StartTime.ToLower().Contains(word)) ||
                        (!string.IsNullOrEmpty(s.EndTime) && s.EndTime.ToLower().Contains(word)) ||
                        s.Day.ToString().ToLower().Contains(word)
                    );
                }
            }
            bool descending = model.SortDescending.GetValueOrDefault();

            if (!string.IsNullOrWhiteSpace(model.SortBy))
            {
                switch (model.SortBy.ToLower())
                {
                    case "name":
                        query = descending
                            ? query.OrderByDescending(s => s.CourseLectures.User.UserName)
                            : query.OrderBy(s => s.CourseLectures.User.UserName);
                        break;
                    case "lastname":
                        query = descending
                            ? query.OrderByDescending(s => s.CourseLectures.User.LastName)
                            : query.OrderBy(s => s.CourseLectures.User.LastName);
                        break;
                    case "group":
                        query = descending
                            ? query.OrderByDescending(s => s.Group.Name)
                            : query.OrderBy(s => s.Group.Name);
                        break;
                    case "hall":
                        query = descending
                            ? query.OrderByDescending(s => s.Halls.Name)
                            : query.OrderBy(s => s.Halls.Name);
                        break;
                    case "location":
                        query = descending
                            ? query.OrderByDescending(s => s.Location.Name)
                            : query.OrderBy(s => s.Location.Name);
                        break;
                    case "department":
                        query = descending
                            ? query.OrderByDescending(s => s.Department.Code)
                            : query.OrderBy(s => s.Department.Code);
                        break;
                    case "day":
                        query = descending
                            ? query.OrderByDescending(s => s.Day)
                            : query.OrderBy(s => s.Day);
                        break;
                    case "starttime":
                        query = descending
                            ? query.OrderByDescending(s => s.StartTime)
                            : query.OrderBy(s => s.StartTime);
                        break;
                    case "endtime":
                        query = descending
                            ? query.OrderByDescending(s => s.EndTime)
                            : query.OrderBy(s => s.EndTime);
                        break;
                    default:
                        break;
                }
            }
            var result = await query.Select(s => new ManualScheduleModel
            {
                Id = s.Id,
                Day = s.Day.ToString(),
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                CourseLecturesId = s.CourseLecturesId,
                HallsId = s.HallsId,
                LocationId = s.LocationId,
                DepartmentId = s.DepartmentId,
                GroupId = s.GroupId,
                HasReport = s.HasReport,
                IsCanceled = s.IsCanceled
            }).ToListAsync(cancellationToken);

            return result;
        }
    }
}
