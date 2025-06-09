using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    public class LocationModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string StreetNo { get; set; }
        public string ZipCode { get; set; }
        public string PhoneNumber { get; set; }
        public Guid? UserId { get; set; }
        public string? UserName { get; set; }
    }
}
