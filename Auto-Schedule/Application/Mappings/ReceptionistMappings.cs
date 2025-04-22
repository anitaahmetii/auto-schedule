using AutoMapper;
using Domain.Entities;
using Domain.Model;

public class ReceptionistMappings : Profile
{
    public ReceptionistMappings()
    {
        CreateMap<Receptionist, ReceptionistModel>()
           .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
           .ForMember(x => x.Responsibilities, y => y.MapFrom(x => x.Responsibilities));


        CreateMap<ReceptionistModel, Receptionist>()
           .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
          .ForMember(x => x.Responsibilities, y => y.MapFrom(x => x.Responsibilities));
    }
}