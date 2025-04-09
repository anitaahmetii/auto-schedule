namespace Domain.Entities
{
    public class Report
    {
        public Guid Id { get; set; }
        public int Absence { get; set; }
        public string Comment { get; set; }
        public DateTime DateTime { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public Guid ScheduleId { get; set; }
        public Schedule Schedule { get; set; }
    }
}
