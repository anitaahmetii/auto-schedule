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
                if (groupSelectionPeriodModel.StartDate > groupSelectionPeriodModel.EndDate) throw new ArgumentException("StartDate duhet të jetë para EndDate.");
                var period = _mapper.Map<GroupSelectionPeriod>(groupSelectionPeriodModel);
                await _context.GroupSelectionPeriods.AddAsync(period, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                return (period == null) ? throw new ArgumentNullException(nameof(groupSelectionPeriodModel)) : groupSelectionPeriodModel;
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
            return (groupSelectionsPeriods.Count == 0) ? throw new KeyNotFoundException(nameof(groupSelectionsPeriods)) : _mapper.Map<List<GroupSelectionPeriodModel>>(groupSelectionsPeriods);
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
