using AutoMapper;
using Domain.Entities;
using Domain.Model;

namespace Application.Mappings
{
    public class CourseLecturesMappings : Profile
    {
        public CourseLecturesMappings()
        {
            CreateMap<CourseLectures, CourseLecturesModel>()
               .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
               .ForMember(x => x.UserId, y => y.MapFrom(x => x.UserId))
               .ForMember(x => x.CourseId, y => y.MapFrom(x => x.CourseId));

            CreateMap<CourseLecturesModel, CourseLectures>()
              .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
              .ForMember(x => x.UserId, y => y.MapFrom(x => x.UserId))
              .ForMember(x => x.CourseId, y => y.MapFrom(x => x.CourseId));
        }
    }
}
