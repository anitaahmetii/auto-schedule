import React from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import {
  MdDashboard,
  MdGroup,
  MdLocationOn,
  MdSchedule,
  MdSchool,
  MdAdd,
  MdPeople,
} from "react-icons/md";
import { UserService } from "../Services/UserService";
import NotificationBell from "./Notifications/NotificationBell";
import { Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    UserService.LogOut(); 
    navigate("/"); 
  };
  const activeStyle = {
    fontWeight: "bold",
    color: "#a0c4ff",
    backgroundColor: "#34495e",
    borderRadius: "8px",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
    fontSize: "1.05rem",
  };

  const defaultStyle = {
    color: "#ecf0f1",
    textDecoration: "none",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "8px",
    fontSize: "1.05rem",
  };
 const isAdmin = UserService.GetUserRole()=== "Admin";
 const isCoordinator = UserService.GetUserRole()==="Coordinator";
 const isReceptionist = UserService.GetUserRole()==="Receptionist";
 const isLecturer = UserService.GetUserRole() === "Lecture";
 const isStudent = UserService.GetUserRole() === "Student";

  const sidebarLinks = [
     { name: "Dashboard Admin", path: "/AdminDashboard", icon: <MdDashboard /> },
    { name: "Dashboard Koordinatori", path: "/CoordinatorDashboard", icon: <MdDashboard /> },
    { name: "Dashboard Lektori", path: "/lecturer", icon: <MdDashboard /> },
    { name: "Daily Schedule", path: "/OrariDitor", icon: <MdSchedule /> },
    { name: "Weekly Schedule", path: "/OrariJavor", icon: <MdSchedule /> },
    { name: "Professor", path: "/lectures", icon: <MdSchool /> },
    { name: "Course", path: "/Course", icon: <MdSchool /> },
    { name: "Group", path: "/Group", icon: <MdGroup /> },
    { name: "Halls", path: "/hall", icon: <MdLocationOn /> },
    { name: "Location", path: "/location", icon: <MdLocationOn /> },
    { name: "State", path: "/State", icon: <MdLocationOn /> },
    { name: "City", path: "/City", icon: <MdLocationOn /> },
    { name: "SchedulteType", path: "/scheduleType", icon: <MdSchedule /> },
    { name: "Schedule", path: "/ManualSchedule", icon: <MdSchedule /> },
    { name: "Group Selection", path: "/GroupSelectionPeriod", icon: <MdGroup /> },
    { name: "Users", path: "/UserTable", icon: <MdPeople /> },
    { name: "Reports", path: "/reports", icon: <MdDashboard /> },
    { name: "Canceled Report", path: "/RaportetAnuluara", icon: <MdDashboard /> },
    { name: "Coordinator", path: "/CoordinatorTable", icon: <MdPeople /> },
    { name: "Receptionist", path: "/receptionist", icon: <MdPeople /> },
    { name: "Department", path: "/DepartmentTable", icon: <MdSchool /> },
    { name: "CourseLecture", path: "/CourseLecturesTable", icon: <MdSchool /> },
    { name: "Zgjedh Lloj Orari", path: "/select-schedule", icon: <MdSchedule /> },
    { name: "Orari Im", path: "/myschedule", icon: <MdSchedule /> },
    { name: "Profile", path: "/student/profile", icon: <MdPeople /> },
    { name: "Daily Schedule", path: "/student/dailyschedule", icon: <MdSchedule /> },
    { name: "Group", path: "/student/group", icon: <MdGroup /> },
    { name: "My Schedule", path: "/student/myschedule", icon: <MdSchedule /> },
    { name: "My Attendances", path: "/student/attendances", icon: <MdSchool /> },
    { name: "Notification", path: "/notifications", icon: <MdSchedule /> },
    { name: "Logout", path: "/", icon: <FaSignOutAlt /> },
  ];
  let filteredLinks = [];

if (isAdmin) {
  filteredLinks = sidebarLinks.filter(link =>
  [
    "/AdminDashboard",
    "/OrariDitor",
    "/OrariJavor",
    "/Course",
    "/Group",
    "/hall",
    "/location",
    "/State",
    "/City",
    "/ManualSchedule",
    "/UserTable",
    "/reports",
    "/RaportetAnuluara",
    "/DepartmentTable",
    "/CourseLecturesTable",
    "/"
  ].includes(link.path)
  );
} else if (isCoordinator) {
  filteredLinks = sidebarLinks.filter(link =>
    [
      "/CoordinatorDashboard",
      "/OrariDitor",
      "/OrariJavor",
      "/ManualSchedule",
      "/GroupSelectionPeriod",
      "/"
    ].includes(link.path)
  );
} else if (isReceptionist) {
  filteredLinks = sidebarLinks.filter(link =>
    [
      "/reports",
      "/RaportetAnuluara",
      "/OrariDitor",
      "/OrariJavor",
      "/"
    ].includes(link.path)
  );
} 
else if (isStudent) {
  filteredLinks = sidebarLinks.filter(link =>
    [
      "/student/profile",
      "/student/dailyschedule",
      "/student/group",
      "/student/myschedule",
      "/student/attendances",
      "/notifications",
      "/"
    ].includes(link.path)
  );
} 
else if (isLecturer) {
  filteredLinks = sidebarLinks.filter(link =>
    [
      "/notifications",
      "/"
    ].includes(link.path)
  );
} 


  return (
    <nav
      style={{
        width: collapsed ? "80px" : "230px",
        background: "#2c3e50",
        color: "white",
        height: "100vh",
        transition: "width 0.3s ease",
        position: "fixed",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "1rem",
          borderBottom: "1px solid #34495e",
        }}
      >
        {!collapsed && <h2 style={{ margin: 0, color: "#ecf0f1" }}></h2>}
        {(isLecturer || isStudent)&& <NotificationBell />}
        <button
          onClick={toggleSidebar}
          style={{
            fontSize: "1.3rem",
            background: "none",
            border: "none",
            color: "#a0c4ff",
            cursor: "pointer",
          }}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
      </div>

      {/* Menu */}
      <ul
        style={{
          listStyle: "none",
          padding: collapsed ? "0.5rem" : "1rem",
          marginTop: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
          width: "100%",
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        {filteredLinks.map((link, index) => (
          <li key={index}>
            {link.name === "Logout" ? (
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  ...defaultStyle,
                }}
              >
                {link.icon}
                {!collapsed && <span>{link.name}</span>}
              </button>
            ) : (
              <NavLink
                to={link.path}
                style={({ isActive }) => (isActive ? activeStyle : defaultStyle)}
              >
                {link.icon}
                {!collapsed && <span>{link.name}</span>}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
