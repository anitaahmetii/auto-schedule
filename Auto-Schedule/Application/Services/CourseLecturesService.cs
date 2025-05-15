using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class CourseLecturesService : ICourseLecturesService
    {
        private readonly AppDbContext appDbContext;
        private readonly IMapper mapper;

        public CourseLecturesService(AppDbContext appDbContext, IMapper mapper)
        {
            this.appDbContext = appDbContext;
            this.mapper = mapper;
        }

        public async Task<CourseLecturesModel> CreateOrUpdate(CourseLecturesModel model, CancellationToken cancellationToken)
        {
            CourseLectures courseLecture = new CourseLectures();
            if (model.Id == null)
            {
                await appDbContext.CourseLectures.AddAsync(courseLecture);
            }
            else
            {
                courseLecture = await appDbContext.CourseLectures.Where(x => x.Id == model.Id).FirstOrDefaultAsync(cancellationToken);
            }
            courseLecture.CourseId = model.CourseId;
            courseLecture.UserId = model.UserId;

            await appDbContext.SaveChangesAsync();

            return await GetById(courseLecture.Id, cancellationToken);
        }

        public async Task<List<CourseLecturesModel>> GetAll(CancellationToken cancellationToken)
        {
            var courseLecture = await appDbContext.CourseLectures.ToListAsync(cancellationToken);

            var model = mapper.Map<List<CourseLecturesModel>>(courseLecture);

            return model;
        }

        public async Task<CourseLecturesModel> GetById(Guid Id, CancellationToken cancellationToken)
        {
            var courseLecture = await appDbContext.CourseLectures.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            var model = mapper.Map<CourseLecturesModel>(courseLecture);

            return model;
        }

        public async Task DeleteById(Guid Id, CancellationToken cancellationToken)
        {
            var courseLecture = await appDbContext.CourseLectures.Where(x => x.Id == Id).FirstOrDefaultAsync(cancellationToken);

            appDbContext.CourseLectures.Remove(courseLecture);
            await appDbContext.SaveChangesAsync();
        }

       
        public async Task<List<ListItemModel>> GetCourseLectures()
        {
            var lectures = await appDbContext.CourseLectures
                .Include(cl => cl.Course)
                .Include(cl => cl.User)
                .Select(cl => new ListItemModel()
                {
                    Id = cl.Id,
                    Name = cl.Course.Name + " " + cl.User.UserName + " " + cl.User.LastName
                })
                .ToListAsync();
            return lectures;
        }
    }
}
