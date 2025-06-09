
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

import StudentProfileTable from './Components/Dashboards/StudentDashboard/StudentProfileTable';
//import CreateManualSchedule from './Components/ManualSchedule/CreateManualSchedule';
//import ManualScheduleTable from './Components/ManualSchedule/ManualScheduleTable';
//import EditManualSchedule from './Components/ManualSchedule/EditManualSchedule';
import GroupSelectionPeriodTable from './Components/GroupSelectionPeriod/GroupSelectionPeriodTable';
import GroupSchedule from './Components/Dashboards/StudentDashboard/GroupScheduleTable';
import StudentDashboard from './Components/Dashboards/StudentDashboard/StudentDashboard';
import MySchedule from './Components/Dashboards/StudentDashboard/MySchedule';
import DailySchedule from './Components/Dashboards/StudentDashboard/DailySchedule';
import DailyScheduleLecture from './Components/LecturerDashboard/DailyScheduleLecture';
import MyAttendances from './Components/Dashboards/StudentDashboard/MyAttendances';
import StudentAttendance from './Components/LecturerDashboard/StudentAttendance';

//import SelectScheduleType from './Components/Lectures/SelectScheduleType';
//import DashboardLayout from "./Components/LecturerDashboard/DashboardLayout";

//import DashboardLecturer from "./Components/LecturerDashboard/Dashboard";

import MySchedulee from "./Components/LecturerDashboard/MySchedulee";
//import DailySchedule from "./Components/LecturerDashboard/DailySchedule";
import LecturesTable from "./Components/Lectures/LecturesTable";
import EditLectures from "./Components/Lectures/EditLectures";
import EditCity from "./Components/City/EditCity";
import EditState from "./Components/State/EditState";
import StateTable from "./Components/State/StateTable";
import ScheduleTypeTable from "./Components/ScheduleType/ScheduleTypeTable";
import EditScheduleType from "./Components/ScheduleType/EditScheduleType";
import UserTable from "./Components/User/UserTable";
import EditUser from "./Components/User/EditUser";
import ReportTable from "./Components/Report/ReportTable";
import ManualScheduleTable from "./Components/ManualSchedule/ManualScheduleTable";
import CreateManualSchedule from "./Components/ManualSchedule/CreateManualSchedule";
import OrariDitor from "./Components/OrariDitor";
import EditManualSchedule from "./Components/ManualSchedule/EditManualSchedule";
import RaportetAnuluara from "./Components/CancelledSchedules/CancelledSchedules";
import AddRaportetAnuluara from "./Components/CancelledSchedules/AddRaportetAnuluara";
import AddTemporarySchedule from "./Components/ManualSchedule/AddTemporarySchedule";
import OrariJavor from "./Components/OrariJavor";
import CoordinatorDashboard from "./Components/CoordinatorDashboard";
import LayoutWithSideBar from './Components/LayoutWithSideBar';
import CityTable from "./Components/City/CityTable";


import LecturerProfileTable from "./Components/LecturerDashboard/LecturerProfileTable";


function App() {
  return (
       <>

    <Router>
     <Routes>
      
       <Route path="/" element={<Login/>}/>
       <Route element={<LayoutWithSideBar />}>
          <Route path="/State" element={<StateTable />} />
          <Route path="/EditState/:id" element={<EditState />} />
          <Route path="/AddState" element={<EditState />} />
          <Route path="/EditCity/:id" element={<EditCity />} />
          <Route path="/AddCity" element={<EditCity />} />
          <Route path="/City" element={<CityTable/>}/>

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
          <Route path="/RaportetAnuluara" element={<RaportetAnuluara />} />

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
          <Route path="/ManualSchedule" element={<ManualScheduleTable />} />

          <Route path="/CreateManualSchedule" element={<CreateManualSchedule />} />
          <Route path="/EditManualSchedule/:id" element={<EditManualSchedule />} />
          
          {/* <Route path='/StudentProfile' element={<StudentProfileTable />} /> */}

          <Route path='/GroupSelection' element={<GroupSelectionPeriodTable />} />

          {/* <Route path='/GroupTable' element={<GroupSchedule />} /> */}

          {/* <Route path='/StudentDashboard' element={<StudentDashboard />}/> */}

          <Route path="/student" element={<StudentDashboard />}>
            <Route path="profile" element={<StudentProfileTable />} />
            <Route path="group" element={<GroupSchedule />} />
            <Route path="myschedule" element={<MySchedule />} />
            <Route path="dailyschedule" element={<DailySchedule />} />
            <Route path="attendances" element={<MyAttendances />} />
          </Route>

          <Route path="/lecture" element={<DailyScheduleLecture />} />
          <Route path="/lecture/studentattendance" element={<StudentAttendance />} />
          <Route path="dailyschedule-lecturer" element={<MySchedule />} />
         <Route path="/myschedulee" element={<MySchedulee />} />

          <Route path="/CreateManualSchedule" element={<CreateManualSchedule/>}/>
          <Route path="/EditManualSchedule/:id" element={<EditManualSchedule/>}/>
          <Route path="OrariDitor" element={<OrariDitor />} />
          <Route path="OrariJavor" element={<OrariJavor />} />
          <Route path="/CoordinatorDashboard" element={<CoordinatorDashboard />} />
          <Route path="/DepartmentTable"  element={<DepartmentTable/>}/>
          <Route path="/AddDepartment" element={<EditDepartment/>}/>
          <Route path="/EditDepartment/:id" element={<EditDepartment/>}/>
          <Route path="/AddCourseLecture" element={<EditCourseLectures/>}/>
          <Route path="/EditCourseLectures/:id" element={<EditCourseLectures/>}/>
          <Route path="/CourseLecturesTable" element={<CourseLecturesTable/>}/>
          <Route path="/AddTemporarySchedule" element={<AddTemporarySchedule />} />
          <Route path="/AddRaportetAnuluara/:scheduleId" element={<AddRaportetAnuluara />} />
          <Route path="/EditRaportetAnuluara/:reportId" element={<AddRaportetAnuluara />} />
          <Route path="myschedule" element={<MySchedule />} />   
         
          <Route path="dailyschedule-lecturer" element={<MySchedule />} />
          

          <Route path="/lecturer-profile" element={<LecturerProfileTable />} />

      </Route>
        </Routes>
      </Router>
     </>
  );
}

export default App;