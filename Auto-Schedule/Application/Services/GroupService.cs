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
    public class GroupService : IGroupService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public GroupService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<GroupModel> CreateGroupAsync(GroupModel groupModel, CancellationToken cancellationToken)
        {
            try
            {
                ValidateGroupModel(groupModel);
                var groups = _mapper.Map<Group>(groupModel);
                await _context.Groups.AddAsync(groups, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                groupModel.Id = groups.Id;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("An error occurred while saving the group to the database.", dbEx);
            }
            catch (ArgumentException argEx)
            {
                throw new Exception("Invalid argument(s) provided.", argEx);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while creating the group.", ex);
            }
            return groupModel;
        }
        public async Task<GroupModel> GetByIdGroupAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var groupId = await _context.Groups.FirstOrDefaultAsync(c => c.Id == Id, cancellationToken);
                if (groupId == null)
                {
                    throw new Exception("Group not found!");
                }

                return _mapper.Map<GroupModel>(groupId);
            }
            catch (OperationCanceledException ex)
            {
                throw new OperationCanceledException("The operation was cancelled.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the group.", ex);
            }
        }
        public async Task<GroupModel> UpdateGroupAsync(GroupModel groupModel, CancellationToken cancellationToken)
        {
            try
            {
                ValidateGroupModel(groupModel);
                var group = await _context.Groups.FindAsync(groupModel.Id);
                if (group == null)
                {
                    throw new Exception("Group not found!");
                }
                _mapper.Map(groupModel, group);
                _context.Groups.Update(group);
                await _context.SaveChangesAsync(cancellationToken);
                return groupModel;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new DbUpdateConcurrencyException("A concurrency error occurred while updating the group.", ex);
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException("A database error occurred while updating the group.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the group.", ex);
            }
        }
        public async Task<List<GroupModel>> GetAllGroupsAsync(CancellationToken cancellationToken)
        {
            try
            {
                var groups = await _context.Groups.ToListAsync(cancellationToken);
                return groups == null ? throw new Exception("No group found!") : _mapper.Map<List<GroupModel>>(groups);
            }
            catch (OperationCanceledException ex)
            {
                throw new OperationCanceledException("The operation was cancelled.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving groups.", ex);
            }
        }
        public async Task<GroupModel> DeleteGroupAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var groupToDelete = await _context.Groups.FirstOrDefaultAsync(c => c.Id == Id, cancellationToken);
                if (groupToDelete == null)
                {
                    throw new Exception("No group found to be deleted!");
                }
                _context.Groups.Remove(groupToDelete);
                await _context.SaveChangesAsync(cancellationToken);
                return _mapper.Map<GroupModel>(groupToDelete);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new DbUpdateConcurrencyException("A concurrency error occurred while deleting the group.", ex);
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException("A database error occurred while deleting the group.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the group.", ex);
            }
        }
        private void ValidateGroupModel(GroupModel groupModel)
        {
            if (groupModel == null)
                throw new ArgumentNullException(nameof(groupModel), "The group model cannot be null.");

            if (string.IsNullOrWhiteSpace(groupModel.Name))
                throw new ArgumentException("The name is required.", nameof(groupModel.Name));

            if (groupModel.Capacity < 0)
                throw new ArgumentOutOfRangeException(nameof(groupModel.Capacity), "The capacity must be a positive number.");
        }

        public async Task<List<ListItemModel>> GetGroupSelectListAsync()
        {
            var model = await _context.Groups.Select(x => new ListItemModel()
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync();

            return model;
        }
        public async Task<GroupModel> GetGroupByStudentAsync(Guid studentId, CancellationToken cancellationToken)
        {
            var student = await _context.Users
                .OfType<Student>()
                .FirstOrDefaultAsync(s => s.Id == studentId, cancellationToken) ?? throw new Exception("Student does not exist!");

            if (student.GroupId == null) throw new Exception("Student has not chosen a group yet!");
            var groups = await _context.Groups.FirstOrDefaultAsync(g => g.Id == student.GroupId, cancellationToken) ?? throw new Exception("Group not found!"); 
            return _mapper.Map<GroupModel>(groups);
        }
    }
}
