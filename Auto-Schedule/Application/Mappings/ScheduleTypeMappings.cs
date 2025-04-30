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
    public class ScheduleTypeMappings : Profile
    {
        public ScheduleTypeMappings()
        {
            // Mapping nga ScheduleType në ScheduleTypeModel
            CreateMap<ScheduleType, ScheduleTypeModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ScheduleTypes, opt => opt.MapFrom(src => src.scheduleTypes)) // Përdorim ScheduleTypeEnum nga ScheduleType
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));

            // Mapping nga ScheduleTypeModel në ScheduleType
            CreateMap<ScheduleTypeModel, ScheduleType>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.scheduleTypes, opt => opt.MapFrom(src => src.ScheduleTypes)) // Përdorim scheduleTypes nga ScheduleTypeModel
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));
        }
    }
}
