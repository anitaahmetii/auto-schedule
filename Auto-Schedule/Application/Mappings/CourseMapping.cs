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
    public class CourseMapping : Profile
    {
        public CourseMapping() 
        {
            CreateMap<CourseModel, Course>()
                .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                .ForMember(x => x.Name, y => y.MapFrom(x => x.Name))
                .ForMember(x => x.ECTS, y => y.MapFrom(x => x.ECTS))
                .ForMember(x => x.Semester, y => y.MapFrom(x => x.Semester))
                .ForMember(x => x.IsLecture, y => y.MapFrom(x => x.IsLecture))
                .ForMember(x => x.IsExcercise, y => y.MapFrom(x => x.IsExcercise))
                .ForMember(x => x.UserId, y => y.MapFrom(x => x.UserId));
        }
    }
}
