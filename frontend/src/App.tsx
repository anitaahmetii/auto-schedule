import React from 'react';
import StateTable from './Components/State/StateTable';
import EditState from './Components/State/EditState';
import CityTable from './Components/City/CityTable';
import EditCity from './Components/City/EditCity';
import LecturesTable from './Components/Lectures/LecturesTable';
import EditLectures from './Components/Lectures/EditLectures';
import ScheduleTypeTable from "./Components/ScheduleType/ScheduleTypeTable"; 
import EditScheduleType from "./Components/ScheduleType/EditScheduleType"; 
import UserTable from "./Components/User/UserTable";
import EditUser from "./Components/User/EditUser";
import ReportTable from "./Components/Report/ReportTable";
import EditReport from "./Components/Report/EditReport";
import CourseTable from "./Components/CourseComponent/CourseTable";
import AddCourse from './Components/CourseComponent/AddCourse';
import EditCourse from './Components/CourseComponent/EditCourse';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupTable from './Components/GroupComponent/GroupTable';
import AddGroup from './Components/GroupComponent/AddGroup';
import EditGroup from './Components/GroupComponent/EditGroup';
import EditLocation from './Components/Location/EditLocation';
import LocationTable from './Components/Location/LocationTable';
import EditHall from './Components/Hall/EditHall';
import HallTable from './Components/Hall/HallTable';
import ReceptionistTable from './Components/Receptionist/ReceptionistTable';
import EditReceptionist from './Components/Receptionist/EditReceptionist';

function App() {
  return (
    <>

    <Router>
     <Routes>
        {/* STATES */}
          <Route path="/" element={<StateTable />} />
          <Route path="/EditState/:id" element={<EditState />} />
          <Route path="/AddState" element={<EditState />} />

          <Route path="/city" element={<CityTable />} />
          <Route path="/EditCity/:id" element={<EditCity />} />
          <Route path="/AddCity" element={<EditCity />} />

          <Route path="/lectures" element={<LecturesTable />} />
          <Route path="/EditLectures/:id" element={<EditLectures />} />
          <Route path="/AddLectures" element={<EditLectures />} />

          {/* SCHEDULE TYPES */}
          <Route path="/scheduleType" element={<ScheduleTypeTable />} />
          <Route path="/EditScheduleType/:id" element={<EditScheduleType />} />
          <Route path="/AddScheduleType" element={<EditScheduleType />} />

          {/* USERS */}
          <Route path="/user" element={<UserTable />} />
          <Route path="/EditUser/:id" element={<EditUser />} />
          <Route path="/AddUser" element={<EditUser />} />

          {/* REPORTS */}
          <Route path="/reports" element={<ReportTable />} />
          <Route path="/EditReport/:id" element={<EditReport />} />
          <Route path="/AddReport" element={<EditReport />} />

          {/* GROUPS */}
          <Route path='/Group' element={<GroupTable />} />
          <Route path="/AddGroup" element={<AddGroup />} />
          <Route path='/EditGroup/:id' element={<EditGroup />} />

          {/* COURSES */}
          <Route path='/Course' element={<CourseTable />} />
          <Route path="/AddCourse" element={<AddCourse />} />
          <Route path='/EditCourse/:id' element={<EditCourse />} />

          <Route path="/hall" element={<HallTable />} />
          <Route path="/EditHall/:id" element={<EditHall />} />
          <Route path="/AddHall" element={<EditHall />} />

          <Route path="/location" element={<LocationTable />} />
          <Route path="/EditLocation/:id" element={<EditLocation />} />
          <Route path="/AddLocation" element={<EditLocation />} />

          <Route path="/receptionist" element={<ReceptionistTable />} />
          <Route path="/EditReceptionist/:id" element={<EditReceptionist />} />
          <Route path="/AddReceptionist" element={<EditReceptionist />} />
        </Routes>
      </Router>
     </>
  );
}

export default App;
