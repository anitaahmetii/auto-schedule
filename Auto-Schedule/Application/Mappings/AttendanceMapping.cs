using AutoMapper;
using Domain.Entities;
using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Mappings
{
    public class AttendanceMapping : Profile
    {
        public AttendanceMapping() 
        {
            CreateMap<AttendanceModel, Attendance>()
                .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                .ForMember(x => x.ConfirmationTime, y => y.MapFrom(x => x.ConfirmationTime))
                .ForMember(x => x.StudentId, y => y.MapFrom(x => x.StudentId))
                .ForMember(x => x.ScheduleId, y => y.MapFrom(x => x.ScheduleId))
                .ReverseMap();
        }
    }
}
