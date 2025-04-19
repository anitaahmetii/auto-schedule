import React from 'react';
import StateTable from "./Components/StateTable";
import EditState from "./Components/EditState";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupTable from './Components/GroupComponent/GroupTable';
import AddGroup from './Components/GroupComponent/AddGroup';
import EditGroup from './Components/GroupComponent/EditGroup';

function App() {
  return (
    <>
    <Router>
     <Routes>
        {/* COURSES  */}
        <Route path='/Group' element={ <GroupTable /> } />
        <Route path="/AddGroup" element={ <AddGroup /> } />
        <Route path='/EditGroup/:id' element={ <EditGroup /> } />

     <Route path="/" element={<StateTable />} />
     <Route path="/EditState/:id" element={<EditState />} />
     <Route path="/AddState" element={<EditState />} />
     </Routes>
     </Router>
     </>
  );
}

export default App;
