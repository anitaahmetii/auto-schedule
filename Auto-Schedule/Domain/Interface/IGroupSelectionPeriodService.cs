using Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interface
{
    public interface IGroupSelectionPeriodService
    {
        Task<GroupSelectionPeriodModel> CreateGroupSelectionPeriodAsync(GroupSelectionPeriodModel groupSelectionPeriodModel, CancellationToken cancellationToken);
        Task<List<GroupSelectionPeriodModel>> GetAllGroupSelectionPeriodsAsync(CancellationToken cancellationToken);
        Task<GroupSelectionPeriodModel> UpdateGroupSelectionPeriodAsync(GroupSelectionPeriodModel groupSelectionPeriodModel, CancellationToken cancellationToken);
        Task<GroupSelectionPeriodModel> DeleteGroupSelectionPeriodAsync(Guid Id, CancellationToken cancellationToken);
        Task<GroupSelectionPeriodModel?> IsGroupSelectionPeriodActiveAsync(Guid DepartmentId, CancellationToken cancellationToken);
    }
}
