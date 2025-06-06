﻿
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class UserRole: IdentityUserRole<Guid>
    {
        public Guid Id { get; set; }    
        public User User { get; set; }
        public Role Role { get; set; }
    }
}
