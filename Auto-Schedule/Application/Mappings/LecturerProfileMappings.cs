using AutoMapper;
using Domain.Entities; // sigurohu që kjo përmban entitetin Lecturer
using Domain.Model;

public class LecturerProfileMapping : Profile
{
    public LecturerProfileMapping()
    {
        CreateMap<Lectures, LecturerProfileModel>()
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
            .ForMember(x => x.AcademicGrade, y => y.MapFrom(x => x.AcademicGrade))
            
            .ReverseMap();
    }
}
