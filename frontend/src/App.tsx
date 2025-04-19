import React from 'react';
import StateTable from "./Components/StateTable";
import EditState from "./Components/EditState";
import ScheduleTypeTable from "./Components/ScheduleType/ScheduleTypeTable";
import EditScheduleType from "./Components/ScheduleType/EditScheduleType";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
     <Routes>
     <Route path="/" element={<StateTable />} />
     <Route path="/EditState/:id" element={<EditState />} />
     <Route path="/AddState" element={<EditState />} />
     <Route path="/scheduleType" element={<ScheduleTypeTable />} />
     <Route path="/EditScheduleType/:id" element={<EditScheduleType />} />
     <Route path="/AddScheduleType" element={<EditScheduleType />} />
     </Routes>
     </Router>
     </>
  );
}

export default App;
