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
    public class GroupSelectionPeriodMapping : Profile
    {
        public GroupSelectionPeriodMapping() 
        {
            CreateMap<GroupSelectionPeriodModel, GroupSelectionPeriod>()
                .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                .ForMember(x => x.StartDate, y => y.MapFrom(x => x.StartDate))
                .ForMember(x => x.EndDate, y => y.MapFrom(x => x.EndDate))
                .ForMember(x => x.StartTime, y => y.MapFrom(x => x.StartTime))
                .ForMember(x => x.EndTime, y => y.MapFrom(x => x.EndTime))
                .ForMember(x => x.DepartmentId, y => y.MapFrom(x => x.DepartmentId))
                .ReverseMap();
        }
    }
}
