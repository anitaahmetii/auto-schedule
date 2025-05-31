import React, { useEffect, useState } from 'react';
import { ManualScheduleService } from '../Services/ManualScheduleService';
import { ManualScheduleModel } from '../Interfaces/ManualScheduleModel';
import {
  Button,
  Confirm,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow
} from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { CourseLecturesService } from '../Services/CourseLecturesService';
import { GroupService } from '../Services/GroupService';
import { HallService } from '../Services/HallService';
import { LocationService } from '../Services/LocationService';
import { DepartmentService } from '../Services/DepartmentService';
import { CourseLecturesModel } from '../Interfaces/CourseLecturesModel';
import { GroupModel } from '../Interfaces/GroupModel';
import { HallModel } from '../Interfaces/HallModel';
import { LocationModel } from '../Interfaces/LocationModel';
import { DepartmentModel } from '../Interfaces/DepartmentModel';

export default function OrariDitor() {
  const [schedules, setSchedules] = useState<ManualScheduleModel[]>([]);
  const [courseLecturesList, setCourseLecturesList] = useState<CourseLecturesModel[]>([]);
        const [groupsList, setGroupsList] = useState<GroupModel[]>([]);
        const [hallsList, setHallsList] = useState<HallModel[]>([]);
        const [locationsList, setLocationsList] = useState<LocationModel[]>([]);
        const [departmentsList, setDepartmentsList] = useState<DepartmentModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState<string>('Are you sure?');
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
  const fetchData = async () => {
    const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
    const capitalizedDay = currentDay.charAt(0).toUpperCase() + currentDay.slice(1).toLowerCase();
    try {
      const result = await ManualScheduleService.GetSchedulesByDay(capitalizedDay);
      const activeSchedules = result.filter((schedule: ManualScheduleModel) => !schedule.isCanceled);

      // Load temporary schedules from localStorage
      const tempSchedules = JSON.parse(localStorage.getItem('tempSchedules') || '[]');
      const validTempSchedules = tempSchedules.filter(
        (s: any) => new Date(s.createdAt).toDateString() === new Date().toDateString()
      );
      // Only include today's temp schedules for today
      const todayTempSchedules = validTempSchedules.filter(
        (s: any) => s.day === capitalizedDay
      );
      // Clear outdated temporary schedules
      const filteredTempSchedules = tempSchedules.filter((s: any) => {
      const scheduledDate = getNextDateForDay(s.day); // e.g. Monday => next Monday
      return scheduledDate.toDateString() === new Date().toDateString(); // show only if it's today
      });

      // Pastro localStorage nga të vjetrit
      const stillValid = tempSchedules.filter((s: any) => {
      const scheduledDate = getNextDateForDay(s.day);
      return scheduledDate >= new Date(); // mbaj vetëm ato që nuk kanë ndodhur ende
      });
      localStorage.setItem('tempSchedules', JSON.stringify(stillValid));

      // Merge and set
      setSchedules([...activeSchedules, ...todayTempSchedules]);
    } catch (err) {
      console.error('Error fetching schedules by day:', err);
    }
  };

  fetchData();
}, []);

useEffect(() => {
          let fetched = false;
          const fetchAll = async () => {
              try 
              {
                  const [cLR, gR, hR, lR, dR] = await Promise.all([
                      CourseLecturesService.GetSelectList(),
                      GroupService.GetSelectList(),
                      HallService.GetSelectList(),
                      LocationService.GetSelectList(),
                      DepartmentService.GetSelectList(),
                  ]);
                  if (!fetched)
                  {
                      setCourseLecturesList(cLR);
                      setGroupsList(gR);
                      setHallsList(hR);
                      setLocationsList(lR);
                      setDepartmentsList(dR);
                  }
              }
              catch (err) 
              {
                  console.error("Lists could not be loaded!", err);
              };
          };
          fetchAll();
          return () => {
              fetched = true;
          };
      }, []);

function getNextDateForDay(day: string): Date {
  const dayMap: any = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6
  };
  const today = new Date();
  const todayDay = today.getDay();
  const targetDay = dayMap[day];
  const delta = (targetDay + 7 - todayDay) % 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + delta);
  return nextDate;
}

  const locationNames = ['All', ...Array.from(new Set(
  schedules.map(s => locationsList.find(l => l.id === s.locationId)?.name).filter(Boolean)
)) as string[]];

const filteredSchedules = selectedLocation === 'All'
  ? schedules
  : schedules.filter(s => {
      const locName = locationsList.find(l => l.id === s.locationId)?.name;
      return locName === selectedLocation;
    });

  function goToPerfundo(id: string) {
    setConfirmMessage('Are you sure you want to proceed to the report page?');
    setConfirmAction(() => () => {
      navigate(`/AddReport/${id}`);
    });
    setOpenConfirm(true);
  }

  return (
    <div className="container mt-4">
      <h1>Schedule</h1>
      <div className="mb-3">
        <label htmlFor="departmentFilter">Filter by Location:</label>
        <select
  id="departmentFilter"
  className="form-select"
  value={selectedLocation}
  onChange={(e) => setSelectedLocation(e.target.value)}
>
  {locationNames.map((loc) => (
    <option key={loc} value={loc}>{loc}</option>
  ))}
</select>
      </div>

      {filteredSchedules.length > 0 && (
        <Table striped>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Day</TableHeaderCell>
              <TableHeaderCell>Start</TableHeaderCell>
              <TableHeaderCell>End</TableHeaderCell>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Halls</TableHeaderCell> 
              <TableHeaderCell>Location</TableHeaderCell> 
              <TableHeaderCell>Group</TableHeaderCell>
              <TableHeaderCell>Course Lecture</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.day}</TableCell>
                <TableCell>{new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</TableCell>
                <TableCell>{new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</TableCell>
                <Table.Cell >{departmentsList.find(d => d.id === item.departmentId)?.name}</Table.Cell>
                <Table.Cell>{hallsList.find(h => h.id === item.hallsId)?.name}</Table.Cell>
                <Table.Cell>{locationsList.find(l => l.id === item.locationId)?.name}</Table.Cell>
                <Table.Cell>{groupsList.find(g => g.id === item.groupId)?.name}</Table.Cell>
                <Table.Cell>{courseLecturesList.find(c => c.id === item.courseLecturesId)?.name}</Table.Cell>
                <TableCell>
                  {userRole === 'Receptionist' && !item.hasReport && !item.id?.startsWith('temp-') && (
                    <Button
                      type="button"
                      className="ui blue basic button"
                      onClick={() => goToPerfundo(item.id!)}
                    >
                      Perfundo
                    </Button>
                  )}
                  {userRole === 'Receptionist' && (item.hasReport || item.id?.startsWith('temp-')) && (
                    <span className="text-muted">Report Added</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Confirm
        open={openConfirm}
        content={confirmMessage}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => {
          confirmAction();
          setOpenConfirm(false);
        }}
      />
    </div>
  );
}
