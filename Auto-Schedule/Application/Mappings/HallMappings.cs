using AutoMapper;
using Domain.Entities;
using Domain.Model;


namespace Application.Mappings
{
    public class HallMappings : Profile
    {
        public HallMappings()
        {
            CreateMap<Halls, HallModel>()
                .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                .ForMember(x => x.Name, y => y.MapFrom(x => x.Name))
                .ForMember(x => x.Capacity, y => y.MapFrom(x => x.Capacity))
                .ForMember(x => x.UserId, y => y.MapFrom(x => x.UserId))
                .ForMember(x => x.LocationId, y => y.MapFrom(x => x.LocationId));

            CreateMap<HallModel, Halls>()
                .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                .ForMember(x => x.Name, y => y.MapFrom(x => x.Name))
                .ForMember(x => x.Capacity, y => y.MapFrom(x => x.Capacity))
                .ForMember(x => x.UserId, y => y.MapFrom(x => x.UserId))
                .ForMember(x => x.LocationId, y => y.MapFrom(x => x.LocationId));

        }
    }
}

