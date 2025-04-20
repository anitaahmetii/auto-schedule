import React from 'react';
import StateTable from "./Components/StateTable";
import EditState from "./Components/EditState";
import CourseTable  from "./Components/CourseComponent/CourseTable";
import AddCourse from './Components/CourseComponent/AddCourse';
import EditCourse from './Components/CourseComponent/EditCourse';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupTable from './Components/GroupComponent/GroupTable';
import AddGroup from './Components/GroupComponent/AddGroup';
import EditGroup from './Components/GroupComponent/EditGroup';

function App() {
  return (
    <>

    <Router>
     <Routes>
        {/* GROUPS  */}
        <Route path='/Group' element={ <GroupTable /> } />
        <Route path="/AddGroup" element={ <AddGroup /> } />
        <Route path='/EditGroup/:id' element={ <EditGroup /> } />
          {/* COURSES  */}
          <Route path='/Course' element={<CourseTable /> } />
          <Route path="/AddCourse" element={<AddCourse />} />
          <Route path='/EditCourse/:id' element={<EditCourse />} />
          {/* STATES  */}
          <Route path="/" element={<StateTable />} />
          <Route path="/EditState/:id" element={<EditState />} />
          <Route path="/AddState" element={<EditState />} />
        </Routes>
      </Router>
     </>
  );
}

export default App;
