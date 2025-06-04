using AutoMapper;
using Domain.Entities;
using Domain.Enum;
using Domain.Model;

namespace Application.Mappings
{
    public class ImportScheduleMappings : Profile
    {

        public ImportScheduleMappings()
        {
            CreateMap<Schedule, ImportScheduleModel>()
            .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department.Code))
            .ForMember(dest => dest.Halls, opt => opt.MapFrom(src => src.Halls.Name))
            .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location.Name))
            .ForMember(dest => dest.Group, opt => opt.MapFrom(src => src.Group.Name))
            .ForMember(dest => dest.CourseLecture, opt => opt.MapFrom(
            src => src.CourseLectures.Course.Name + " " + src.CourseLectures.User.UserName +
            " " + src.CourseLectures.User.LastName));
            CreateMap<ImportScheduleModel, Schedule>();
        }
    }
}
