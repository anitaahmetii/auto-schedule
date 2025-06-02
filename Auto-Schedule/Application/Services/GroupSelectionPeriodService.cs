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
    public class GroupSelectionPeriodService : IGroupSelectionPeriodService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public GroupSelectionPeriodService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<GroupSelectionPeriodModel> CreateGroupSelectionPeriodAsync(GroupSelectionPeriodModel groupSelectionPeriodModel, CancellationToken cancellationToken)
        {
            try
            {
                if (groupSelectionPeriodModel.StartDate > groupSelectionPeriodModel.EndDate) throw new ArgumentException("Start date must be earlier than the end date.");
                //if (groupSelectionPeriodModel.StartTime > groupSelectionPeriodModel.EndTime) throw new ArgumentException("Start time must be earlier than the end time.");
                var exists = await _context.GroupSelectionPeriods
                    .AnyAsync(p => p.DepartmentId == groupSelectionPeriodModel.DepartmentId, cancellationToken);

                if (exists)
                    throw new Exception("A group selection period has already been set for this department.");

                var period = _mapper.Map<GroupSelectionPeriod>(groupSelectionPeriodModel);
                await _context.GroupSelectionPeriods.AddAsync(period, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                return  groupSelectionPeriodModel;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("An error occurred while saving the selection period to the database.", dbEx);
            }
            catch (ArgumentException argEx)
            {
                throw new Exception("Invalid argument(s) provided.", argEx);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while creating the group selection period.", ex);
            }
        }
        public async Task<GroupSelectionPeriodModel> DeleteGroupSelectionPeriodAsync(Guid Id, CancellationToken cancellationToken)
        {
            var periodId = await _context.GroupSelectionPeriods.FirstOrDefaultAsync(p => p.Id == Id, cancellationToken) ?? throw new Exception("No group selection period found to be deleted!");
            _context.GroupSelectionPeriods.Remove(periodId);
            await _context.SaveChangesAsync(cancellationToken);
            return _mapper.Map<GroupSelectionPeriodModel>(periodId);
        }
        public async Task<List<GroupSelectionPeriodModel>> GetAllGroupSelectionPeriodsAsync(CancellationToken cancellationToken)
        {
            var groupSelectionsPeriods = await _context.GroupSelectionPeriods.ToListAsync(cancellationToken);
            return _mapper.Map<List<GroupSelectionPeriodModel>>(groupSelectionsPeriods);
        }

        public async Task<GroupSelectionPeriodModel?> IsGroupSelectionPeriodActiveAsync(Guid departmentId, CancellationToken cancellationToken)
        {
            var period = await _context.GroupSelectionPeriods
                .FirstOrDefaultAsync(p => p.DepartmentId == departmentId, cancellationToken);

            if (period == null)
            {
                return null;
            }

            var now = DateTime.Now;

            var start = period.StartDate.ToDateTime(period.StartTime);
            var end = period.EndDate.ToDateTime(period.EndTime);

            if (now >= start && now <= end)
            {
                return _mapper.Map<GroupSelectionPeriodModel>(period);
            }
            return null;
            //throw new InvalidOperationException("No active group selection period at this time.");
        }

        public async Task<GroupSelectionPeriodModel> UpdateGroupSelectionPeriodAsync(GroupSelectionPeriodModel groupSelectionPeriodModel, CancellationToken cancellationToken)
        {
            var period = await _context.GroupSelectionPeriods.FindAsync(groupSelectionPeriodModel.Id, cancellationToken);
            _mapper.Map(groupSelectionPeriodModel, period);
            await _context.SaveChangesAsync(cancellationToken);
            return (groupSelectionPeriodModel == null) ? throw new KeyNotFoundException(nameof(groupSelectionPeriodModel)) : groupSelectionPeriodModel;
        }
    }
}
