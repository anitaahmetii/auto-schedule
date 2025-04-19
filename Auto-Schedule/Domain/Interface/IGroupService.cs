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
    }
}
