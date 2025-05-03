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
    public class LecturesMappings : Profile
    {
        public LecturesMappings()
        {
            CreateMap<Lectures, LecturesModel>()
               .ForMember(x => x.AcademicGrade, y => y.MapFrom(x => x.AcademicGrade))
               .ForMember(x => x.lectureType, y => y.MapFrom(x => x.lectureType))
               .ForMember(x => x.ScheduleTypeId, y => y.MapFrom(x => x.ScheduleTypeId));

            CreateMap<LecturesModel, Lectures>()
              .ForMember(x => x.AcademicGrade, y => y.MapFrom(x => x.AcademicGrade))
              .ForMember(x => x.lectureType, y => y.MapFrom(x => x.lectureType))
              .ForMember(x => x.ScheduleTypeId, y => y.MapFrom(x => x.ScheduleTypeId));
        }
    }
}
