import React, { useState } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaCalendar,
  FaCheckSquare,
  FaSignOutAlt,
} from "react-icons/fa";
import { UserService } from "../../Services/UserService";
import { Button } from "semantic-ui-react";
import NotificationBell from '../Notifications/NotificationBell';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navigate = useNavigate();
  function LogOut(){
    UserService.LogOut();
    setTimeout(()=>{
      navigate("/");
    },1000)
  }

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
    fontSize: "1.1rem",
  };

  const defaultStyle = {
    color: "#ecf0f1",
    textDecoration: "none",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
  };

  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          width: isOpen ? "220px" : "80px",
          background: "#2c3e50",
          color: "white",
          height: "100vh",
          transition: "width 0.3s ease",
          boxSizing: "border-box",
          position: "fixed",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Inside your header div: */}
        <div
          style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          padding: "1rem",
          backgroundColor: "#2c3e50",
          boxSizing: "border-box",
          borderBottom: "1px solid #34495e",
          }}
        >
          {isOpen && <h2 style={{ margin: 0, color: "#ecf0f1" }}>Lecturer</h2>}

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <NotificationBell />
            <button
              onClick={toggleSidebar}
              style={{
                fontSize: "1.5rem",
                background: "none",
                border: "none",
                color: "#a0c4ff",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </button>
          </div>
        </div>
        {/* Menu items */}
        <ul
          style={{
            listStyle: "none",
            padding: isOpen ? "1rem" : "0.5rem",
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            width: "100%",
          }}
        >
          <li>
            <NavLink
              to="/lecturer/myschedule"
              style={({ isActive }) => (isActive ? activeStyle : defaultStyle)}
            >
              <FaCalendar />
              {isOpen && <span>My Schedule</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/lecturer/notifications"
              style={({ isActive }) => (isActive ? activeStyle : defaultStyle)}
            >
              <FaCalendar />
              {isOpen && <span>Notifications</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/OrariDitor"
              style={({ isActive }) => (isActive ? activeStyle : defaultStyle)}
            >
              <FaCalendar />
              {isOpen && <span>Daily Schedule</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/lecturer/select-schedule"
              style={({ isActive }) => (isActive ? activeStyle : defaultStyle)}
            >
              <FaCheckSquare />
              {isOpen && <span>Select Schedule</span>}
            </NavLink>
          </li>

          {/* Ikona për Logout */}
          <li>
            <Button
              style={defaultStyle}
              type="button"
              onClick={LogOut}
            >
              <FaSignOutAlt />
              {isOpen && <span>Logout</span>}
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;




