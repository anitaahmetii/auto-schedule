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
    public class LocationMappings : Profile
    {
        public LocationMappings()
        {
            CreateMap<Location, LocationModel>()
               .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
               .ForMember(x => x.Name, y => y.MapFrom(x => x.Name))
               .ForMember(x => x.City, y => y.MapFrom(x => x.City))
               .ForMember(x => x.StreetNo, y => y.MapFrom(x => x.streetNo))
               .ForMember(x => x.PhoneNumber, y => y.MapFrom(x => x.PhoneNumber))
               .ForMember(x => x.ZipCode, y => y.MapFrom(x => x.ZipCode))
               .ForMember(x => x.UserId, y => y.MapFrom(x => x.UserId));

            CreateMap<LocationModel, Location>()
                  .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
               .ForMember(x => x.Name, y => y.MapFrom(x => x.Name))
               .ForMember(x => x.City, y => y.MapFrom(x => x.City))
               .ForMember(x => x.streetNo, y => y.MapFrom(x => x.StreetNo))
               .ForMember(x => x.PhoneNumber, y => y.MapFrom(x => x.PhoneNumber))
               .ForMember(x => x.ZipCode, y => y.MapFrom(x => x.ZipCode))
               .ForMember(x => x.UserId, y => y.MapFrom(x => x.UserId));



        }
    }
}
