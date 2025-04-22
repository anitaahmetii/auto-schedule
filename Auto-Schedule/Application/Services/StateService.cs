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
    public class StateService : IStateService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public StateService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        public async Task<StateModel> CreateOrUpdate(StateModel model, CancellationToken cancellationToken)
        {
            State state = new State();
            if (model.Id == null)
            {
                await appDbContext.States.AddAsync(state);
            }
            else
            {
                state = await appDbContext.States.Where(x => x.Id == model.Id).FirstOrDefaultAsync(cancellationToken);
            }
            state.Name = model.Name;

            await appDbContext.SaveChangesAsync();

            return await GetById(state.Id, cancellationToken);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var state = await appDbContext.States.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            appDbContext.States.Remove(state);
            await appDbContext.SaveChangesAsync();
        }

        public async Task<List<StateModel>> GetAll(CancellationToken cancellationToken)
        {
            var state = await appDbContext.States.ToListAsync(cancellationToken);

            var model = mapper.Map<List<StateModel>>(state);

            return model;
        }

        public async Task<StateModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var state = await appDbContext.States.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            var model = mapper.Map<StateModel>(state);

            return model;
        }
        public async Task<List<ListItemModel>> GetStateSelectListAsync(CancellationToken cancellationToken)
        {
            var model = await appDbContext.States.Select(x => new ListItemModel()
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync(cancellationToken);

            return model;
        }
    }
}
