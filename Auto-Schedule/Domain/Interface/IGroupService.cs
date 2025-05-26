using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IGroupService
    {
        Task<GroupModel> CreateGroupAsync(GroupModel groupModel, CancellationToken cancellationToken);
        Task<GroupModel> GetByIdGroupAsync(Guid Id, CancellationToken cancellationToken);
        Task<GroupModel> UpdateGroupAsync(GroupModel groupModel, CancellationToken cancellationToken);
        Task<List<GroupModel>> GetAllGroupsAsync(CancellationToken cancellationToken);
        Task<GroupModel> DeleteGroupAsync(Guid Id, CancellationToken cancellationToken);
        public Task<List<ListItemModel>> GetGroupSelectListAsync();

    }
}
