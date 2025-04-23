using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class CoordinatorService : ICoordinatorService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public CoordinatorService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        public async Task<CoordinatorModel> CreateOrUpdate(CoordinatorModel model, CancellationToken cancellationToken)
        {
            Coordinator coordinator = new Coordinator();
            if (model.Id == null)
            {
                await appDbContext.Coordinators.AddAsync(coordinator);
            }
            else
            {
                coordinator = await appDbContext.Coordinators.Where(x => x.Id == model.Id).FirstOrDefaultAsync(cancellationToken);
            }
            coordinator.Responsibilities = model.Responsibilities;

            await appDbContext.SaveChangesAsync();

            return await GetById(coordinator.Id, cancellationToken);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var coordinator = await appDbContext.Coordinators.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            appDbContext.Coordinators.Remove(coordinator);
            await appDbContext.SaveChangesAsync();
        }

        public async Task<List<CoordinatorModel>> GetAll(CancellationToken cancellationToken)
        {
            var coordinator = await appDbContext.Coordinators.ToListAsync(cancellationToken);

            var model = mapper.Map<List<CoordinatorModel>>(coordinator);

            return model;
        }

        public async Task<CoordinatorModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var coordinator = await appDbContext.Coordinators.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            var model = mapper.Map<CoordinatorModel>(coordinator);

            return model;
        }
    }
}
