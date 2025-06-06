﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class City
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid StateId { get; set; }

        public State State { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
