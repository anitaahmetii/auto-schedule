namespace Domain.Model
{
    public class ScheduleModel
    {
        public Guid? Id { get; set; }
        public string Day { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        //public string CourseLecture { get; set; }
        public string Hall { get; set; }
        public string Location { get; set; }
        public string Department { get; set; }
        public string Group { get; set; }
    }
}
