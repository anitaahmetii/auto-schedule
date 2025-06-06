﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class State
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public ICollection<City> Cities { get; set; } = new List<City>();
    }
}
