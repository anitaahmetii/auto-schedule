using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Configuration;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class HallService : IHallService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public HallService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        public async Task<HallModel> CreateOrUpdate(HallModel model, CancellationToken cancellationToken)
        {
            Halls hall = new Halls();

            if (model.Id == null)
            {
                await appDbContext.Halls.AddAsync(hall);
            }
            else
            {
                hall = await appDbContext.Halls.Where(x => x.Id == model.Id).FirstOrDefaultAsync(cancellationToken);

            }
            hall.Name = model.Name;
            hall.Capacity = model.Capacity;
            //hall.UserId = model.UserId;
            hall.LocationId = model.LocationId;

            await appDbContext.SaveChangesAsync(cancellationToken);

            return await GetById(hall.Id, cancellationToken);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var hall = await appDbContext.Halls.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            appDbContext.Halls.Remove(hall);
            await appDbContext.SaveChangesAsync(cancellationToken);

        }

        public async Task<List<HallModel>> GetAll(CancellationToken cancellationToken)
        {
            var hall = await appDbContext.Halls.ToListAsync(cancellationToken);
            var model = mapper.Map<List<HallModel>>(hall);
            return model;
        }

        public async Task<HallModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var hall = await appDbContext.Halls.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);
            var model = mapper.Map<HallModel>(hall);
            return model;
        }
        public async Task<List<ListItemModel>> GetHallsSelectListAsync(CancellationToken cancellationToken)
        {
            try
            {
                var halls = await appDbContext.Halls.Select(x => new ListItemModel
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToListAsync(cancellationToken);
                return halls;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error on GetHallsSelectListAsync: " + ex.Message);
                throw; 
            }
        }
    }
}




