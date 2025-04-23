using AutoMapper;
using Domain.Entities;
using Domain.Model;

namespace Application.Mappings
{
    public class DepartmentMappings : Profile
    {
        public DepartmentMappings()
        {
            CreateMap<Department, DepartmentModel>()
               .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
               .ForMember(x => x.Name, y => y.MapFrom(x => x.Name))
               .ForMember(x => x.Code, y => y.MapFrom(x => x.Code));
            //.ForMember(x=>x.UserId, y=>y.MapFrom(x=>x.UserId))
            //.ForMember(x => x.UserName, y => y.MapFrom(x => x.User.UserName));

            CreateMap<DepartmentModel, Department>()
              .ForMember(x => x.Id, y => y.MapFrom(x => x.Id))
              .ForMember(x => x.Name, y => y.MapFrom(x => x.Name))
              .ForMember(x => x.Code, y => y.MapFrom(x => x.Code));
            //.ForMember(x => x.UserId, y => y.MapFrom(x => x.UserId));
        }
    }
}
