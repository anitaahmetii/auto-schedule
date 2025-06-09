
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
import GroupSelectionPeriodTable from './Components/GroupSelectionPeriod/GroupSelectionPeriodTable';
// import StudentDashboard from './Components/Dashboards/StudentDashboard/StudentDashboard';
import DailyScheduleLecture from './Components/Dashboards/LectureDashboard/DailyScheduleLecture';
import StudentAttendance from './Components/Dashboards/LectureDashboard/StudentAttendance';

//import SelectScheduleType from './Components/Lectures/SelectScheduleType';
//import DashboardLayout from "./Components/LecturerDashboard/DashboardLayout";

import DashboardLecturer from "./Components/LecturerDashboard/Dashboard";
import SelectScheduleType from "./Components/LecturerDashboard/SelectScheduleType";
import NotificationPage from "./Components/Notifications/NotificationPage";
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
import OrariDitor from "./Components/OrariDitor";
import RaportetAnuluara from "./Components/CancelledSchedules/CancelledSchedules";
import AddRaportetAnuluara from "./Components/CancelledSchedules/AddRaportetAnuluara";
import AddTemporarySchedule from "./Components/ManualSchedule/AddTemporarySchedule";
import OrariJavor from "./Components/OrariJavor";
import CoordinatorDashboard from "./Components/CoordinatorDashboard";
import LayoutWithSideBar from './Components/LayoutWithSideBar';
import CityTable from "./Components/City/CityTable";
import { startNotificationConnection } from './Services/NotificationService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addNotification } from './Services/notificationsSlice';
import { v4 as uuidv4 } from 'uuid';
import { NotificationModel } from './Interfaces/NotificationModel';
import { store } from './store';
import { useEffect } from "react";
import StudentProfileTable from "./Components/Student/StudentProfileTable";
import GroupSchedule from "./Components/Student/GroupScheduleTable";
import MySchedule from "./Components/LecturerDashboard/MySchedule";
import MyStudentSchedule from "./Components/Student/MySchedule";
import DailySchedule from "./Components/Student/DailySchedule";
import MyAttendances from "./Components/Student/MyAttendances";
// import ScheduleSearchTable from "./Components/Student/ScheduleSearchTable";

function App() {
  window.addEventListener("beforeunload", () => {
    const state = store.getState();
    localStorage.setItem("notifications", JSON.stringify(state.notifications));
  });
  const user = JSON.parse(localStorage.getItem("userModel") || "{}");
  const dispatch = useDispatch();
  useEffect(() => {
    const notificationsJson = localStorage.getItem("notifications");

    if (notificationsJson) {
      try {
        const missed = JSON.parse(notificationsJson);

        missed.forEach((n: NotificationModel) => {
          toast.info("🔔 Missed: " + n.message);

          dispatch(addNotification(n));
        });

        localStorage.removeItem("notifications"); // show ONCE
      } catch (err) {
        console.error("Failed to parse notifications", err);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      startNotificationConnection((message: string) => {
        console.log("📥 Real-time message received:", message); // Add this!
        toast.info("📢 " + message);

        dispatch(addNotification({
          id: uuidv4(),
          userId: user.id,
          message,
          timestamp: new Date().toISOString(),
          isRead: false
        }));
      }, token);
    }
  }, []);

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
          <Route path="/AddReport" element={<EditReport />} />
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
            <Route path="/student/profile" element={<StudentProfileTable />} />
            <Route path="/student/group" element={<GroupSchedule />} />
            <Route path="/student/myschedule" element={<MyStudentSchedule />} />
            <Route path="/student/dailyschedule" element={<DailySchedule />} />
            <Route path="/student/attendances" element={<MyAttendances />} />


          <Route path="/lecture" element={<DailyScheduleLecture />} />
          <Route path="/lecture/studentattendance" element={<StudentAttendance />} />

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
          <Route path="select-schedule" element={<SelectScheduleType />} /> 
          <Route path="myschedule" element={<MySchedule />} />   
          <Route path="/lecturer" element={<DashboardLecturer />}/>
          <Route path="/notifications" element={<NotificationPage/>}/>
          <Route path="/SelectScheduleType" element={<SelectScheduleType />} />
          <Route path="dailyschedule-lecturer" element={<MySchedule />} />
          <Route path="/GroupSelectionPeriod" element={<GroupSelectionPeriodTable />} />
          {/* <Route path="search" element={<ScheduleSearchTable onResults={}/>}/> */}
      </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} />
     </>
  );
}

export default App;