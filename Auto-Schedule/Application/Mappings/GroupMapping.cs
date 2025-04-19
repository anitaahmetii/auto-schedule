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
    public class GroupMapping : Profile
    {
        public GroupMapping() 
        {
            CreateMap<GroupModel, Group>()
                .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                .ForMember(x => x.Name, y => y.MapFrom(y => y.Name))
                .ForMember(x => x.Capacity, y => y.MapFrom(y => y.Capacity))
                .ForMember(x => x.UserId, y => y.MapFrom(y => y.UserId));
        }
    }
}
