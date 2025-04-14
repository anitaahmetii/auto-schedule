import React from 'react';
import StateTable from "./Components/StateTable";
import EditState from "./Components/EditState";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
     <Routes>
     <Route path="/" element={<StateTable />} />
     <Route path="/EditState/:id" element={<EditState />} />
     <Route path="/AddState" element={<EditState />} />
     </Routes>
     </Router>
     </>
  );
}

export default App;
