import React from 'react';
import StateTable from "./Components/StateTable";
import EditState from "./Components/EditState";
import ReportTable from "./Components/Report/ReportTable";
import EditReport from "./Components/Report/EditReport";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
     <Routes>
     <Route path="/" element={<StateTable />} />
     <Route path="/EditState/:id" element={<EditState />} />
     <Route path="/AddState" element={<EditState />} />
     <Route path="/reports" element={<ReportTable />} />
     <Route path="/EditReport/:id" element={<EditReport />} />
     <Route path="/AddReport" element={<EditReport />} />
     </Routes>
     </Router>
     </>
  );
}

export default App;
