import React, { useEffect, useState } from "react";

const SelectScheduleType = () => {
  const [scheduleType, setScheduleType] = useState("");
  const [savedScheduleType, setSavedScheduleType] = useState("");
  const [selectionTime, setSelectionTime] = useState(null);
  const [selectionDate, setSelectionDate] = useState(null);
  const [isSelectionEnabled, setIsSelectionEnabled] = useState(false);
  const [now, setNow] = useState(new Date());

  const selectionStartDate = new Date("2025-05-28T14:00:00");
  const selectionEndDate = new Date("2025-06-10T13:40:00");

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedType = localStorage.getItem("savedScheduleType");
    const savedTime = localStorage.getItem("selectionTime");
    const savedDate = localStorage.getItem("selectionDate");

    if (savedType && savedTime && savedDate) {
      setSavedScheduleType(savedType);
      setSelectionTime(savedTime);
      setSelectionDate(savedDate);
      setScheduleType(savedType);
    }

    const isWithinDeadline = now >= selectionStartDate && now <= selectionEndDate;
    setIsSelectionEnabled(isWithinDeadline);
  }, [now]);

 const getTimeLeft = () => {
  const diff = selectionEndDate - now;
  if (diff <= 0) return "00:00";

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
};

  const handleSave = () => {
    if (scheduleType) {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const formattedDate = now.toLocaleDateString("en-GB");

      setSavedScheduleType(scheduleType);
      setSelectionTime(formattedTime);
      setSelectionDate(formattedDate);

      localStorage.setItem("savedScheduleType", scheduleType);
      localStorage.setItem("selectionTime", formattedTime);
      localStorage.setItem("selectionDate", formattedDate);
    }
  };

  const handleUnregister = () => {
    setScheduleType("");
    setSavedScheduleType("");
    setSelectionTime(null);
    setSelectionDate(null);

    localStorage.removeItem("savedScheduleType");
    localStorage.removeItem("selectionTime");
    localStorage.removeItem("selectionDate");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        padding: "2rem",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      {/* Status message */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
     {now < selectionStartDate ? (
  <div style={{
    backgroundColor: "#ffeeba",
    color: "#856404",
    border: "1px solid #ffeeba",
    padding: "1rem",
    borderRadius: "8px",
    fontWeight: "600",
  }}>
    Selection starts on: {selectionStartDate.toLocaleDateString("en-GB")} at{" "}
    {selectionStartDate.toLocaleTimeString("en-GB")}
  </div>
) : now >= selectionStartDate && now <= selectionEndDate ? (
  savedScheduleType ? (
    <div style={{
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
      padding: "1rem",
      borderRadius: "8px",
      fontWeight: "600",
    }}>
      You have selected schedule type: <strong>{savedScheduleType}</strong>
      <br />
      <span style={{ fontWeight: "normal" }}>
        Time left to make changes: <strong>{getTimeLeft()}</strong>
      </span>
    </div>
  ) : (
    <div style={{
      backgroundColor: "#cce5ff",
      color: "#004085",
      border: "1px solid #b8daff",
      padding: "1rem",
      borderRadius: "8px",
      fontWeight: "600",
    }}>
      You can select the schedule type until:{" "}
      {selectionEndDate.toLocaleDateString("en-GB")} at{" "}
      {selectionEndDate.toLocaleTimeString("en-GB")} (
      <strong>time left: {getTimeLeft()}</strong>)
    </div>
  )
) : (
  savedScheduleType ? (
    <div style={{
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
      padding: "1rem",
      borderRadius: "8px",
      fontWeight: "600",
    }}>
      You had selected schedule type: <strong>{savedScheduleType}</strong><br />
      <span style={{ fontWeight: "normal" }}>
        The selection period is over. You can no longer make changes.
      </span>
    </div>
  ) : (
    <div style={{
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      padding: "1rem",
      borderRadius: "8px",
      fontWeight: "600",
    }}>
      The selection deadline has passed!
    </div>
  )
)}
      </div>

      {/* Form for schedule selection */}
      {isSelectionEnabled && (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
            Select Schedule Type
          </h2>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="schedule"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
              }}
            >
              Schedule Type
            </label>
            <select
              id="schedule"
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                backgroundColor: "#fff",
              }}
            >
              <option value="">-- Select schedule type --</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleSave}
              disabled={!scheduleType}
              style={{
                flex: 1,
                backgroundColor: scheduleType ? "#007bff" : "#ccc",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: scheduleType ? "pointer" : "not-allowed",
              }}
            >
              Save
            </button>

            <button
              onClick={handleUnregister}
              style={{
                flex: 1,
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Unregister
            </button>
          </div>
        </div>
      )}

      {/* Table with saved selection */}
      {savedScheduleType && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Saved Schedule</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f1f1f1" }}>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Type</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{savedScheduleType}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                  {selectionDate} {selectionTime}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SelectScheduleType;












