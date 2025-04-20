import React from 'react';
import StateTable from "./Components/StateTable";
import EditState from "./Components/EditState";
import UserTable from "./Components/User/UserTable";
import EditUser from "./Components/User/EditUser";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
     <Routes>
     <Route path="/" element={<StateTable />} />
     <Route path="/EditState/:id" element={<EditState />} />
     <Route path="/AddState" element={<EditState />} />
     <Route path="/user" element={<UserTable />} />
     <Route path="/EditUser/:id" element={<EditUser />} />
     <Route path="/AddUser" element={<EditUser />} />
     </Routes>
     </Router>
     </>
  );
}

export default App;
