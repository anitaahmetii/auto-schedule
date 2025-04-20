using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class GroupModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public Guid UserId { get; set; }
    }
}
