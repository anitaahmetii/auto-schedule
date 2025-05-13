import React, { useState } from "react";
import Profile from "./Profile";
import ScheduleType from "./ScheduleType";

const DashboardLecturer = () => {
  const [selectedPage, setSelectedPage] = useState("profile");

  const renderContent = () => {
    switch (selectedPage) {
      case "profile":
        return <Profile />;
      case "schedule":
        return <ScheduleType />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-6 shadow-md">
        <div className="text-2xl font-bold mb-8 border-b border-gray-700 pb-4">
          Lecturer Dashboard
        </div>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => setSelectedPage("profile")}
            className={`text-left px-4 py-2 rounded hover:bg-gray-700 transition ${
              selectedPage === "profile" ? "bg-gray-700" : ""
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setSelectedPage("schedule")}
            className={`text-left px-4 py-2 rounded hover:bg-gray-700 transition ${
              selectedPage === "schedule" ? "bg-gray-700" : ""
            }`}
          >
            Select Schedule Type
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-10 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardLecturer;




