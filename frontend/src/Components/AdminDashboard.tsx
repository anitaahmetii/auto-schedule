import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { LecturesService } from "../Services/LecturesService";
import { LocationService } from "../Services/LocationService";
import { StudentProfileService } from "../Services/StudentProfileService";
import { DepartmentService } from "../Services/DepartmentService";
import { DepartmentStudentCountModel } from "../Interfaces/DepartmentStudentCountModel";
import SchoolIcon from "@mui/icons-material/School";
import PlaceIcon from "@mui/icons-material/Place";
import PeopleIcon from "@mui/icons-material/People";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
  // Shtetet për numrat e Lectures, Students dhe Locations
  const [lectureCount, setLectureCount] = useState<number>(0);
  const [locationCount, setLocationCount] = useState<number>(0);
  const [studentCount, setStudentCount] = useState<number>(0);

  // Të dhënat për PieChart-in e departamenteve
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);

  // Funksionet për marrje të të dhënave nga backend
  const fetchLectureCount = async () => {
    try {
      const count = await LecturesService.CountLectures();
      setLectureCount(count);
    } catch (error) {
      console.error("Error fetching lecture count:", error);
    }
  };

  const fetchLocationCount = async () => {
    try {
      const count = await LocationService.CountLocations();
      setLocationCount(count);
    } catch (error) {
      console.error("Error fetching location count:", error);
    }
  };

  const fetchStudentCount = async () => {
    try {
      const count = await StudentProfileService.CountStudents();
      setStudentCount(count);
    } catch (error) {
      console.error("Error fetching student count:", error);
    }
  };

  const fetchDepartmentStudentCounts = async () => {
    try {
      const data: DepartmentStudentCountModel[] =
        await DepartmentService.GetDepartmentStudentCounts();

      const total = data.reduce((sum, d) => sum + d.studentCount, 0);

      if (total === 0) {
        setPieData([]);
        return;
      }

      const pieFormatted = data.map((d) => ({
        name: d.departmentName,
        value: parseFloat(((d.studentCount / total) * 100).toFixed(2))
      }));

      setPieData(pieFormatted);
    } catch (error) {
      console.error("Error fetching department student counts:", error);
    }
  };

  // Fetch i të gjitha të dhënave në ngarkim të komponentit
  useEffect(() => {
    fetchLectureCount();
    fetchLocationCount();
    fetchStudentCount();
    fetchDepartmentStudentCounts();
  }, []);

  // Ngjyrat për PieChart (rotacion nëse ka më shumë departamente)
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#dc3545",
    "#20c997"
  ];

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      {/* Cards për Lectures, Students dhe Locations */}
      <Row className="mb-4">
        <Col md={4}>
          <Card
            className="shadow-sm border-0"
            style={{ backgroundColor: "#0d6efd", color: "white" }}
          >
            <Card.Body>
              <Card.Title>
                <SchoolIcon style={{ marginRight: "8px" }} />
                Total Lectures
              </Card.Title>
              <h3>{lectureCount}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="shadow-sm border-0"
            style={{ backgroundColor: "#198754", color: "white" }}
          >
            <Card.Body>
              <Card.Title>
                <PeopleIcon style={{ marginRight: "8px" }} />
                Total Students
              </Card.Title>
              <h3>{studentCount}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="shadow-sm border-0"
            style={{ backgroundColor: "#6f42c1", color: "white" }}
          >
            <Card.Body>
              <Card.Title>
                <PlaceIcon style={{ marginRight: "8px" }} />
                Total Locations
              </Card.Title>
              <h3>{locationCount}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pie Chart për Përqindjen e Studentëve sipas Departamentit */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                Përqindja e Studentëve sipas Departamentit
              </Card.Title>
              <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
