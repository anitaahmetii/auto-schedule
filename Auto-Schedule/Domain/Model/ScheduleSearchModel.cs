using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class ScheduleSearchModel
    {
        public string? Day { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public List<Guid>? CourseLecturesId { get; set; }
        public List<Guid>? HallsId { get; set; }
        public List<Guid>? LocationId { get; set; }  
        public List<Guid>? DepartmentId { get; set; } 
        public List<Guid>? GroupId { get; set; }
        public string? SearchText { get; set; }
        public string? SortBy { get; set; }
        public bool? SortDescending { get; set; } = false;
        public int? PageNumber { get; set; } = 1;
        public int? PageSize { get; set; } = 10;

    }
}
