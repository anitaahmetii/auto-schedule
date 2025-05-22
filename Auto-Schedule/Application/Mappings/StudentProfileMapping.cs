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
    public class StudentProfileMapping : Profile
    {
        public StudentProfileMapping() 
        {
            CreateMap<Student, StudentProfileModel>()
                .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                .ForMember(x => x.Email, y => y.MapFrom(x => x.Email))
                .ForMember(x => x.UserName, y => y.MapFrom(x => x.UserName))
                .ForMember(x => x.LastName, y => y.MapFrom(x => x.LastName))
                .ForMember(x => x.AcademicProgram, y => y.MapFrom(x => x.AcademicProgram))
                .ForMember(x => x.GroupId, y => y.MapFrom(x => x.GroupId))
                .ReverseMap();
        }
    }
}
