using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Mappings
{
    public class ManualScheduleMapping : Profile
    {
        public ManualScheduleMapping() 
        {
            CreateMap<ManualScheduleModel, Schedule>()
                .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                .ForMember(x => x.Day, y => y.MapFrom(x => Enum.Parse<Days>(x.Day)))
                .ForMember(x => x.StartTime, y => y.MapFrom(x => x.StartTime))
                .ForMember(x => x.EndTime, y => y.MapFrom(x => x.EndTime))
                .ForMember(x => x.CourseLecturesId, y => y.MapFrom(x => x.CourseLecturesId))
                .ForMember(x => x.HallsId, y => y.MapFrom(x => x.HallsId))
                .ForMember(x => x.LocationId, y => y.MapFrom(x => x.LocationId))
                .ForMember(x => x.DepartmentId, y => y.MapFrom(x => x.DepartmentId))
                .ForMember(x => x.GroupId, y => y.MapFrom(x => x.GroupId));
        }
    }
}
