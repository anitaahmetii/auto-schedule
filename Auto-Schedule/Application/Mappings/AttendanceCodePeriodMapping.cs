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
    public class AttendanceCodePeriodMapping : Profile
    {
        public AttendanceCodePeriodMapping() 
        {
            CreateMap<AttendanceCodePeriodModel, AttendanceCodePeriod>()
                .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                .ForMember(x => x.Code, y => y.MapFrom(x => x.Code))
                .ForMember(x => x.StartDateTime, y => y.MapFrom(x => x.StartDateTime))
                .ForMember(x => x.EndDateTime, y => y.MapFrom(x => x.EndDateTime))
                .ForMember(x => x.ScheduleId, y => y.MapFrom(x => x.ScheduleId))
                .ReverseMap();
        }
    }
}
