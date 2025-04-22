using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ScheduleTypeService : IScheduleTypeService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public ScheduleTypeService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        public async Task<ScheduleTypeModel> CreateOrUpdate(ScheduleTypeModel model, CancellationToken cancellationToken)
        {
            ScheduleType scheduleType;

            // Nëse është një ScheduleType i ri
            if (model.Id == null)
            {
                scheduleType = new ScheduleType
                {
                    scheduleTypes = model.scheduleTypes,  // Emri i fushës është i saktë
                    UserId = model.UserId
                };

                // Shto në databazë
                await appDbContext.ScheduleType.AddAsync(scheduleType, cancellationToken);
            }
            else
            {
                // Merr ScheduleType ekzistues për ta përditësuar
                scheduleType = await appDbContext.ScheduleType
                    .Where(x => x.Id == model.Id)
                    .FirstOrDefaultAsync(cancellationToken);

                if (scheduleType != null)
                {
                    // Përditëso fushat për ScheduleType ekzistues
                    scheduleType.scheduleTypes = model.scheduleTypes;
                    scheduleType.UserId = model.UserId;
                }
                else
                {
                    throw new Exception("ScheduleType not found");
                }
            }

            // Ruaj ndryshimet në databazë
            await appDbContext.SaveChangesAsync(cancellationToken);

            // Kthe modelin e përditësuar
            return await GetById(scheduleType.Id, cancellationToken);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            // Gjej ScheduleType për ta fshirë
            var scheduleType = await appDbContext.ScheduleType
                .Where(x => x.Id == Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (scheduleType != null)
            {
                appDbContext.ScheduleType.Remove(scheduleType);
                await appDbContext.SaveChangesAsync(cancellationToken);
            }
            else
            {
                throw new Exception("ScheduleType not found");
            }
        }

        public async Task<List<ScheduleTypeModel>> GetAll(CancellationToken cancellationToken)
        {
            // Merr të gjitha ScheduleTypes
            var scheduleTypes = await appDbContext.ScheduleType.ToListAsync(cancellationToken);

            // Mapo në një listë të ScheduleTypeModel
            var model = mapper.Map<List<ScheduleTypeModel>>(scheduleTypes);

            return model;
        }

        public async Task<ScheduleTypeModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            // Merr ScheduleType me ID
            var scheduleType = await appDbContext.ScheduleType
                .Where(x => x.Id == Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (scheduleType == null)
                throw new Exception("ScheduleType not found");

            // Mapo në ScheduleTypeModel dhe ktheje
            var model = mapper.Map<ScheduleTypeModel>(scheduleType);
            return model;
        }

        public async Task<List<ListItemModel>> GetScheduleTypeSelectListAsync(CancellationToken cancellationToken)
        {
            var model = await appDbContext.ScheduleType.Select(x => new ListItemModel()
            {
                Id = x.Id,
                scheduleTypes = x.scheduleTypes
            }).ToListAsync(cancellationToken);

            return model;
        }
    }
}
