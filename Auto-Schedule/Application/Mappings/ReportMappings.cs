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
   public class ReportMappings : Profile
    {
        public ReportMappings()
        {
            CreateMap<Report, ReportModel>()
                 .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                 .ForMember(x => x.Absence, y => y.MapFrom(x => x.Absence))
                 .ForMember(x => x.Comment, y => y.MapFrom(x => x.Comment))
                 .ForMember(x => x.DateTime, y => y.MapFrom(x => x.DateTime))
                 .ForMember(x => x.UserId, y => y.MapFrom(x => x.UserId))
                 .ForMember(x => x.ScheduleId, y => y.MapFrom(x => x.ScheduleId));

            CreateMap<ReportModel, Report>()
                .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
                .ForMember(x => x.Absence, y => y.MapFrom(x => x.Absence))
                .ForMember(x => x.Comment, y => y.MapFrom(x => x.Comment))
                .ForMember(x => x.DateTime, y => y.MapFrom(x => x.DateTime))
                .ForMember(x => x.UserId, y => y.MapFrom(x => x.UserId))
                .ForMember(x => x.ScheduleId, y => y.MapFrom(x => x.ScheduleId));
        }
    }
}
