import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { ManualScheduleService } from "../Services/ManualScheduleService";
import { Container, Row, Col, Card } from "react-bootstrap";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupIcon from '@mui/icons-material/Group';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CoordinatorDashboard() {
  const [scheduleCount, setScheduleCount] = useState<number>(0);
  const[canceledSchedule, setCanceledSchedule]= useState<number>(0);
  const [scheduleByDay, setScheduleByDay] = useState<Record<string, number>>({});

  const fetchScheduleCount = async () => {
    try {
      const count = await ManualScheduleService.CountSchedule();
      setScheduleCount(count);
    } catch (error) {
      console.error('Error fetching schedule count:', error);
    }
  };
  const fetchCanceledScheduleCount = async () => {
    try {
      const count = await ManualScheduleService.CountCanceledSchedules();
      setCanceledSchedule(count);
    } catch (error) {
      console.error('Error fetching canceled schedules count:', error);
    }
  };
  const fetchScheduleByDay = async () => {
  try {
    const data = await ManualScheduleService.CountSchedulesByDay();
    setScheduleByDay(data);
  } catch (error) {
    console.error("Error fetching schedules by day:", error);
  }
};
  useEffect(() => {
    fetchScheduleCount();
    fetchCanceledScheduleCount();
    fetchScheduleByDay();
  }, []);
 const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]; 
  const chartData = {
 labels: daysOfWeek,
  datasets: [
    {
      label: "Number Of Schedules",
      data: Object.values(scheduleByDay), 
     backgroundColor: [
        '#4e79a7', // blu
        '#f28e2b', // portokalli
        '#e15759', // e kuqe
        '#76b7b2', // jeshile kaltër
        '#59a14f', // jeshile
        '#edc948', // verdhë
        '#b07aa1', // vjollcë
      ],
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: {
      display: true,
      text: "Schedules by day of the week",
    },
  },
};
 return (
  <>
    <Container className="mt-4">
  <h2 className="mb-4 text-center">Dashboard</h2>
  <Row className="mb-4">
    <Col md={4}>
      <Card className="shadow-sm border-0" style={{ backgroundColor: "#198754", color: "white", cursor: "pointer" }}>
        <Card.Body>
          <Card.Title>
            <CalendarTodayIcon style={{ marginRight: "8px" }} />
            All Schedules
          </Card.Title>
          <h3>{scheduleCount}</h3>
        </Card.Body>
      </Card>
    </Col>
    <Col md={4}>
      <Card className="shadow-sm border-0" style={{ backgroundColor: "#0d6efd", color: "white", cursor: "pointer" }}>
        <Card.Body>
          <Card.Title>
            <CancelIcon style={{ marginRight: "8px" }} />
            Canceled Schedules
          </Card.Title>
          <h3>{canceledSchedule}</h3>
        </Card.Body>
      </Card>
    </Col>
    <Col md={4}>
      <Card className="shadow-sm border-0" style={{ backgroundColor: "#6f42c1", color: "white", cursor: "pointer" }}>
        <Card.Body>
          <Card.Title>
            <GroupIcon style={{ marginRight: "8px" }} />
            Group Selection Period
          </Card.Title>
          <p className="mb-0">Click to select period</p>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
      <Container className="mb-4">
  <Card className="shadow-sm border-0">
    <Card.Body>
      <Card.Title className="text-center mb-3">Weekly Schedule Chart</Card.Title>
      <Bar data={chartData} options={chartOptions} />
    </Card.Body>
  </Card>
</Container>
</>
    );
 
}
