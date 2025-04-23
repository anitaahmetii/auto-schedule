using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Model;

namespace Application.Mappings
{
    public class ScheduleMappings : Profile
    {

        public ScheduleMappings()
        {
            CreateMap<Schedule, ScheduleModel>()
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department.Code))
            .ForMember(dest => dest.Hall, opt => opt.MapFrom(src => src.Halls.Name))
            .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location.Name))
            .ForMember(dest => dest.Group, opt => opt.MapFrom(src => src.Group.Name));
            CreateMap<ScheduleModel, Schedule>();
        }
    }
}
