import React from 'react';
import './Services/AxiosInstance'
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
import CoordinatorTable from './Components/Coordinator/CoordinatorTable';
import DepartmentTable from './Components/Department/DepartmentTable';
import EditDepartment from './Components/Department/EditDepartment';
import EditCoordinator from './Components/Coordinator/EditCoordinator';
import EditCourseLectures from './Components/CourseLectures/EditCourseLectures';
import CourseLecturesTable from './Components/CourseLectures/CourseLecturesTable';
import Login from './Components/Login';
import Header from './Components/Header';
import CreateManualSchedule from './Components/ManualSchedule/CreateManualSchedule';
import ManualScheduleTable from './Components/ManualSchedule/ManualScheduleTable';
import EditManualSchedule from './Components/ManualSchedule/EditManualSchedule';
import OrariDitor from './Components/OrariDitor';
import OrariJavor from './Components/OrariJavor';
import RaportetAnuluara from './Components/CancelledSchedules/CancelledSchedules';
import AddRaportetAnuluara from './Components/CancelledSchedules/AddRaportetAnuluara';
import AddTemporarySchedule from './Components/ManualSchedule/AddTemporarySchedule';
import DashboardLecturer from "./Components/LecturerDashboard/Dashboard";
import SelectScheduleType from "./Components/LecturerDashboard/SelectScheduleType";
import MySchedule from "./Components/LecturerDashboard/MySchedule";       
        
        

function App() {
  return (
    <>

    <Router>
     <Routes>
          <Route path="/Header" element={<Header/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/State" element={<StateTable />} />
          <Route path="/EditState/:id" element={<EditState />} />
          <Route path="/AddState" element={<EditState />} />

          <Route path="/city" element={<CityTable />} />
          <Route path="/EditCity/:id" element={<EditCity />} />
          <Route path="/AddCity" element={<EditCity />} />

          <Route path="/lectures" element={<LecturesTable />} />
          <Route path="/EditLectures/:id" element={<EditLectures />} />
          <Route path="/AddLectures" element={<EditLectures />} />

          <Route path="/scheduleType" element={<ScheduleTypeTable />} />
          <Route path="/EditScheduleType/:id" element={<EditScheduleType />} />
          <Route path="/AddScheduleType" element={<EditScheduleType />} />

          <Route path="/UserTable" element={<UserTable />} />
          <Route path="/EditUser/:id" element={<EditUser />} />
          <Route path="/AddUser" element={<EditUser />} />

          <Route path="/reports" element={<ReportTable />} />
          <Route path="/EditReport/:reportId" element={<EditReport />} />
          <Route path="/AddReport/:scheduleId" element={<EditReport />} />

          <Route path='/Group' element={<GroupTable />} />
          <Route path="/AddGroup" element={<AddGroup />} />
          <Route path='/EditGroup/:id' element={<EditGroup />} />

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

          <Route path="/CoordinatorTable" element={<CoordinatorTable />} />
          <Route path="/EditCoordinator/:id" element={<EditCoordinator />} />
          <Route path="/AddCoordinator" element={<EditCoordinator />} />

          <Route path="/DepartmentTable" element={<DepartmentTable />} />
          <Route path="/EditDepartment/:id" element={<EditDepartment />} />
          <Route path="/AddDepartment" element={<EditDepartment />} />

          <Route path="/" element={<CourseLecturesTable />} />
          <Route path="/EditCourseLecture/:id" element={<EditCourseLectures />} />
          <Route path="/AddCourseLecture" element={<EditCourseLectures />} />

          <Route path="/ManualSchedule" element={<ManualScheduleTable />} />
          <Route path="/CreateManualSchedule" element={<CreateManualSchedule />} />
          <Route path="/EditManualSchedule/:id" element={<EditManualSchedule />} />

          <Route path="/OrariDitor" element={<OrariDitor />} />

          <Route path="/OrariJavor" element={<OrariJavor />} />
          <Route path="/RaportetAnuluara" element={<RaportetAnuluara />} />
          <Route path="/AddRaportetAnuluara/:scheduleId" element={<AddRaportetAnuluara />} />
          <Route path="/EditRaportetAnuluara/:reportId" element={<AddRaportetAnuluara />} />

          <Route path="/AddTemporarySchedule" element={<AddTemporarySchedule />} />


         
          <Route path="/lecturer" element={<DashboardLecturer />}>
          <Route path="myschedule" element={<MySchedule />} />         
          <Route path="select-schedule" element={<SelectScheduleType />} /> 

        </Route>

        </Routes>
      </Router>
     </>
  );
}

export default App;
