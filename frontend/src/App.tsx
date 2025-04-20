import React from 'react';
import StateTable from "./Components/StateTable";
import EditState from "./Components/EditState";
import CourseTable  from "./Components/CourseComponent/CourseTable";
import AddCourse from './Components/CourseComponent/AddCourse';
import EditCourse from './Components/CourseComponent/EditCourse';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
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
