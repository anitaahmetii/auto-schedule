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
    public class CityMappings : Profile
    {
        public CityMappings()
        {
            CreateMap<City, CityModel>()
               .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
               .ForMember(x => x.Name, y => y.MapFrom(x => x.Name))
               .ForMember(x => x.StateId, y => y.MapFrom(x => x.StateId));

            CreateMap<CityModel, City>()
              .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
              .ForMember(x => x.Name, y => y.MapFrom(x => x.Name))
              .ForMember(x => x.StateId, y => y.MapFrom(x => x.StateId));
        }
    }
}
