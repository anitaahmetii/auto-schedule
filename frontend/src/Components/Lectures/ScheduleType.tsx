import React, { useState } from "react";

const ScheduleType = () => {
  const [selected, setSelected] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Schedule type saved: ${selected}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Select Schedule Type</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select --</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default ScheduleType;
