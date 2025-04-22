using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class ReceptionistService : IReceptionistService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public ReceptionistService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        public async Task<ReceptionistModel> CreateOrUpdate(ReceptionistModel model, CancellationToken cancellationToken)
        {
            Receptionist receptionist = new Receptionist();
            if (model.Id == null)
            {
                await appDbContext.Receptionists.AddAsync(receptionist);
            }
            else
            {
                receptionist = await appDbContext.Receptionists.Where(x => x.Id == model.Id).FirstOrDefaultAsync(cancellationToken);
            }

            receptionist.Responsibilities = model.Responsibilities;

            await appDbContext.SaveChangesAsync();

            return await GetById(receptionist.Id, cancellationToken);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var receptionists = await appDbContext.Receptionists.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            appDbContext.Receptionists.Remove(receptionists);
            await appDbContext.SaveChangesAsync(cancellationToken);

        }

        public async Task<List<ReceptionistModel>> GetAll(CancellationToken cancellationToken)
        {
            var receptionists = await appDbContext.Receptionists.ToListAsync(cancellationToken);
            var model = mapper.Map<List<ReceptionistModel>>(receptionists);
            return model;
        }

        public async Task<ReceptionistModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var receptionists = await appDbContext.Receptionists.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);
            var model = mapper.Map<ReceptionistModel>(receptionists);
            return model;
        }

    }
}
