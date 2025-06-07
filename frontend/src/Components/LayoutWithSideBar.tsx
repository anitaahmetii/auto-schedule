import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const LayoutWithSideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Kjo do të jetë funksioni që kalon në Sidebar për të ndryshuar gjendjen
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <main
        style={{
          marginLeft: collapsed ? "80px" : "230px", // Margin kur sidebar është collapsed ose open
          padding: "1rem",
          width: `calc(100% - ${collapsed ? "80px" : "230px"})`,
          transition: "margin-left 0.3s ease", // Animacion i butë për ndryshim margin
        }}
      >
        {/* <div style={{ flex: 1, padding: '2rem', background: 'white',  overflowY: "auto"}}> */}
          <Outlet />
        {/* </div> */}
      </main>
    </div>
  );
};

export default LayoutWithSideBar;
