using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Enum
{
    //[JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ScheduleTypes
    {
        Morning = 1,
        Afternoon = 2,
        Hybrid = 3
    }
}
