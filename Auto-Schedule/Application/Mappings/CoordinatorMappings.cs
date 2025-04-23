using AutoMapper;
using Domain.Entities;
using Domain.Model;

namespace Application.Mappings
{
    public class CoordinatorMappings : Profile
    {
        public CoordinatorMappings()
        {
            CreateMap<Coordinator, CoordinatorModel>()
               .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
               .ForMember(x => x.Responsibilities, y => y.MapFrom(x => x.Responsibilities));

            CreateMap<CoordinatorModel, Coordinator>()
              .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
              .ForMember(x => x.Responsibilities, y => y.MapFrom(x => x.Responsibilities));
        }
    }
}
