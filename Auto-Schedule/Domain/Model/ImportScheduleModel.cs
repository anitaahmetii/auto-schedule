namespace Domain.Model
{
    public class ImportScheduleModel
    {
        public Guid? Id { get; set; }
        public string Day { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string CourseLecture { get; set; }
        public string Halls { get; set; }
        public string Location { get; set; }
        public string Department { get; set; }
        public string Group { get; set; }
    }
}
