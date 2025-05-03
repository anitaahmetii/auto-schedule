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
    public class LecturesService : ILecturesService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public LecturesService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        public async Task<LecturesModel> CreateOrUpdate(LecturesModel model, CancellationToken cancellationToken)
        {
            Lectures lectures = new Lectures();
            if (model.Id == null)
            {
                await appDbContext.Lectures.AddAsync(lectures);
            }
            else
            {
                lectures = await appDbContext.Lectures.Where(x => x.Id == model.Id).FirstOrDefaultAsync(cancellationToken);
            }
            lectures.AcademicGrade = model.AcademicGrade;
            lectures.lectureType = model.lectureType;
            lectures.ScheduleTypeId = model.ScheduleTypeId;

            await appDbContext.SaveChangesAsync();

            return await GetById(lectures.Id, cancellationToken);
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var lectures = await appDbContext.Lectures.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            appDbContext.Lectures.Remove(lectures);
            await appDbContext.SaveChangesAsync();
        }

        public async Task<List<LecturesModel>> GetAll(CancellationToken cancellationToken)
        {
            var lectures = await appDbContext.Lectures.ToListAsync(cancellationToken);

            var model = mapper.Map<List<LecturesModel>>(lectures);

            return model;
        }

        public async Task<LecturesModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var lectures = await appDbContext.Lectures.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            var model = mapper.Map<LecturesModel>(lectures);

            return model;
        }
    }
}
