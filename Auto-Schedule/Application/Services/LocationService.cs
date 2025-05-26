using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class LocationService : ILocationService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public LocationService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        public async Task<LocationModel> CreateOrUpdate(LocationModel model, CancellationToken cancellationToken)
        {
            Location location = new Location();
            if (model.Id == null)
            {
                await appDbContext.Location.AddAsync(location);
            }
            else
            {
                location = await appDbContext.Location.Where(x => x.Id == model.Id).FirstOrDefaultAsync(cancellationToken);
            }
            location.Name = model.Name;
            location.City = model.City;
            location.streetNo = model.StreetNo;
            location.ZipCode = model.ZipCode;
            location.PhoneNumber = model.PhoneNumber;
            //location.UserId = model.UserId;

            await appDbContext.SaveChangesAsync();

            return await GetById(location.Id, cancellationToken);
        }
        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var location = await appDbContext.Location.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);
            appDbContext.Location.Remove(location);
            await appDbContext.SaveChangesAsync();
        }

        public async Task<LocationModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var location = await appDbContext.Location.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            var model = mapper.Map<LocationModel>(location);

            return model;
        }

        public async Task<List<LocationModel>> GetAll(CancellationToken cancellationToken)
        {
            var location = await appDbContext.Location.ToListAsync(cancellationToken);

            var model = mapper.Map<List<LocationModel>>(location);

            return model;
        }

        public async Task<List<ListItemModel>> GetLocationSelectListAsync()
        {
            var model = await appDbContext.Location.Select(x => new ListItemModel()
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync();

            return model;
        }
    }
}

