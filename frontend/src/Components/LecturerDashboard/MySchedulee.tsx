import { Fragment, useEffect, useState } from "react";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { ManualScheduleService } from "../../Services/ManualScheduleService";
import ShowTable from '../Dashboards/StudentDashboard/ShowTable';

export default function MySchedulee() {
  const [schedule, setSchedule] = useState<ManualScheduleModel[]>([]);

  useEffect(() => {
    const fetchLecturerSchedule = async () => {
      try {
        const data = await ManualScheduleService.getMyScheduleAsync(); // <-- metoda e re
        const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const sortedData = data.sort((a, b) => {
          const dayComparison = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
          if (dayComparison !== 0) return dayComparison;
          return a.startTime.localeCompare(b.startTime);
        });

        setSchedule(sortedData);
      } catch (error) {
        console.error("Error fetching lecturer schedule:", error);
      }
    };

    fetchLecturerSchedule();
  }, []);

  return (
    <Fragment>
      <div className="d-flex justify-content-center align-items-center flex-column" style={{ paddingTop: "2%" }}>
        <h1 style={{ marginBottom: "20px", fontWeight: "bold", wordSpacing: "2px" }}>My Schedule</h1>
        {schedule.length > 0 ? (
          <ShowTable schedule={schedule} />
        ) : (
          <p>No schedule found.</p>
        )}
      </div>
    </Fragment>
  );
}


