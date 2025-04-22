using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class CityService : ICityService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public CityService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        public async Task<CityModel> CreateOrUpdate(CityModel model, CancellationToken cancellationToken)
        {
            City city = new City();
            if (model.Id == null)
            {
                await appDbContext.Cities.AddAsync(city);
            }
            else
            {
                city = await appDbContext.Cities.Where(x => x.Id == model.Id).FirstOrDefaultAsync(cancellationToken);
            }
            city.Name = model.Name;
            city.StateId = model.StateId;

            await appDbContext.SaveChangesAsync();

            return await GetById(city.Id, cancellationToken);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var city = await appDbContext.Cities.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            appDbContext.Cities.Remove(city);
            await appDbContext.SaveChangesAsync();
        }

        public async Task<List<CityModel>> GetAll(CancellationToken cancellationToken)
        {
            var city = await appDbContext.Cities.ToListAsync(cancellationToken);

            var model = mapper.Map<List<CityModel>>(city);

            return model;
        }

        public async Task<CityModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var city = await appDbContext.Cities.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            var model = mapper.Map<CityModel>(city);

            return model;
        }
    }
}
