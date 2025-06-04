import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    console.log("Roli nga localStorage:", role);

    if (role === "Lecture") {
  setAuthorized(true);
} else {
      setAuthorized(false);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Duke verifikuar qasjen...</div>;
  }

  if (!authorized) {
  return null; // mos shfaq asgjë
}

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: "2rem", background: "#ecf0f1" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;


