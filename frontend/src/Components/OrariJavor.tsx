import React, { useEffect, useState } from 'react';
import { ManualScheduleService } from '../Services/ManualScheduleService';
import { ManualScheduleModel } from '../Interfaces/ManualScheduleModel';
import { Button, Confirm, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { CourseLecturesModel } from '../Interfaces/CourseLecturesModel';
import { GroupModel } from '../Interfaces/GroupModel';
import { HallModel } from '../Interfaces/HallModel';
import { LocationModel } from '../Interfaces/LocationModel';
import { DepartmentModel } from '../Interfaces/DepartmentModel';
import { CourseLecturesService } from '../Services/CourseLecturesService';
import { GroupService } from '../Services/GroupService';
import { HallService } from '../Services/HallService';
import { LocationService } from '../Services/LocationService';
import { DepartmentService } from '../Services/DepartmentService';

export default function OrariJavor() {
  const [schedules, setSchedules] = useState<ManualScheduleModel[]>([]);
  const [courseLecturesList, setCourseLecturesList] = useState<CourseLecturesModel[]>([]);
  const [groupsList, setGroupsList] = useState<GroupModel[]>([]);
  const [hallsList, setHallsList] = useState<HallModel[]>([]);
  const [locationsList, setLocationsList] = useState<LocationModel[]>([]);
  const [departmentsList, setDepartmentsList] = useState<DepartmentModel[]>([]);
  const userRole = localStorage.getItem('role');
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
    const [confirmMessage, setConfirmMessage] = useState<string>('Are you sure?');
    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const sortedSchedules = schedules.slice().sort((a, b) => 
    {
        const dayComparison = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
        if (dayComparison !== 0) return dayComparison;

        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
        return 0;
    });
  useEffect(() => {
    const fetchData = async () => {
    const result = await ManualScheduleService.getAllManualSchedulesAsync();
    const activeSchedules = result.filter((schedule: ManualScheduleModel) => !schedule.isCanceled);

    // Lexo temporary schedules
    const tempRaw = localStorage.getItem('tempSchedules');
    const today = new Date();

    let tempSchedules: ManualScheduleModel[] = [];
    if (tempRaw) {
      const parsed = JSON.parse(tempRaw);
      tempSchedules = parsed.filter((s: any) => {
        const dayMatch = s.day && ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].includes(s.day);
        const futureOrToday = new Date(s.createdAt).toDateString() <= today.toDateString(); // ose kontroll me s.day në bazë të javës
        return dayMatch && futureOrToday;
      });
    }

    const allSchedules = [...activeSchedules, ...tempSchedules];
    
    setSchedules(allSchedules);
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

  

  function goToPerfundo(id: string) {
    setConfirmMessage('Are you sure you want to proceed to the report page?');
    setConfirmAction(() => () => {
      navigate(`/AddReport/${id}`);
    });
    setOpenConfirm(true);
  }
  function anuloOrarin(id: string) {
    setConfirmMessage('Are you sure you want to proceed to the report page?');
    setConfirmAction(() => () => {
      navigate(`/AddRaportetAnuluara/${id}`);
    });
    setOpenConfirm(true);
  }

  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h1>Schedule</h1>
      {schedules.length > 0 && (
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
            {sortedSchedules.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.day}</TableCell>
                <TableCell>{item.startTime}</TableCell>
                <TableCell>{item.endTime}</TableCell>
                <Table.Cell >{departmentsList.find(d => d.id === item.departmentId)?.name}</Table.Cell>
                <Table.Cell>{hallsList.find(h => h.id === item.hallsId)?.name}</Table.Cell>
                <Table.Cell>{locationsList.find(l => l.id === item.locationId)?.name}</Table.Cell>
                <Table.Cell>{groupsList.find(g => g.id === item.groupId)?.name}</Table.Cell>
                <Table.Cell>{courseLecturesList.find(c => c.id === item.courseLecturesId)?.name}</Table.Cell>
                
                <TableCell>
                  {userRole === 'Receptionist' &&(
                  <Button
                    type="button"
                    className="ui red basic button"
                    onClick={() => anuloOrarin(item.id!)}
                  >
                    Anulo
                  </Button>
                  )}

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
