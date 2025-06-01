import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Sidebar />
      <main
        style={{
          flexGrow: 1,
          padding: "2rem",
          background: "#ecf0f1",
        }}
      >
        

        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;