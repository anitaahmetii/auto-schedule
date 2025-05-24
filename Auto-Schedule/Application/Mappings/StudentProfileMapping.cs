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
                .ForMember(x => x.PersonalID, y => y.MapFrom(x => x.PersonalID))
                .ForMember(x => x.Email, y => y.MapFrom(x => x.Email))
                .ForMember(x => x.UserName, y => y.MapFrom(x => x.UserName))
                .ForMember(x => x.LastName, y => y.MapFrom(x => x.LastName))
                .ForMember(x => x.Birthdate, y => y.MapFrom(x => x.Birthdate))
                .ForMember(x => x.CityId, y => y.MapFrom(x => x.CityId))
                .ForMember(x => x.Address, y => y.MapFrom(x => x.Address))
                .ForMember(x => x.Gender, y => y.MapFrom(x => x.Gender))
                .ForMember(x => x.PersonalEmail, y => y.MapFrom(x => x.PersonalEmail))
                .ForMember(x => x.PhoneNumber, y => y.MapFrom(x => x.PhoneNumber))
                .ForMember(x => x.DepartmentId, y => y.MapFrom(x => x.DepartmentId))
                .ForMember(x => x.AcademicProgram, y => y.MapFrom(x => x.AcademicProgram))
                .ForMember(x => x.AcademicYear, y => y.MapFrom(x => x.AcademicYear))
                .ForMember(x => x.Registred, y => y.MapFrom(x => x.Registred))
                .ForMember(x => x.GroupId, y => y.MapFrom(x => x.GroupId))
                .ReverseMap();
        }
    }
}
