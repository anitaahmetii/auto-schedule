import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Button, Modal, Table } from "semantic-ui-react";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { ManualScheduleService } from "../../Services/ManualScheduleService";
import { CourseLecturesService } from "../../Services/CourseLecturesService";
import { CourseLecturesModel } from "../../Interfaces/CourseLecturesModel";
import { GroupModel } from "../../Interfaces/GroupModel";
import { GroupService } from "../../Services/GroupService";
import { HallModel } from "../../Interfaces/HallModel";
import { HallService } from "../../Services/HallService";
import { LocationModel } from "../../Interfaces/LocationModel";
import { LocationService } from "../../Services/LocationService";
import { DepartmentModel } from "../../Interfaces/DepartmentModel";
import { DepartmentService } from "../../Services/DepartmentService";
  import * as XLSX from 'xlsx';
  import { saveAs } from 'file-saver';

export default function ManualScheduleTable()
{
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState<ManualScheduleModel[]>([]);
    const [courseLecturesList, setCourseLecturesList] = useState<CourseLecturesModel[]>([]);
    const [groupsList, setGroupsList] = useState<GroupModel[]>([]);
    const [hallsList, setHallsList] = useState<HallModel[]>([]);
    const [locationsList, setLocationsList] = useState<LocationModel[]>([]);
    const [departmentsList, setDepartmentsList] = useState<DepartmentModel[]>([]);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [deletedScheduleId, setDeletedScheduleId] = useState<string>("");
    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     const [advancedSearchTerm, setAdvancedSearchTerm] = useState<string>("");


  const [filterDay, setFilterDay] = useState<string | "">("");
  const [filterCourseLecture, setFilterCourseLecture] = useState<string | "">("");
  const [filterGroup, setFilterGroup] = useState<string | "">("");
  const [filterHall, setFilterHall] = useState<string | "">("");
  const [filterLocation, setFilterLocation] = useState<string | "">("");
  const [filterDepartment, setFilterDepartment] = useState<string | "">("");
  const [filterIsCanceled, setFilterIsCanceled] = useState<boolean | null>(null);

const exportToExcel = () => {
  const data = filteredSchedules.map(schedule => ({
    Lecture: courseLecturesList.find(c => c.id === schedule.courseLecturesId)?.name || '',
    Day: schedule.day,
    Start: schedule.startTime,
    End: schedule.endTime,
    Group: groupsList.find(g => g.id === schedule.groupId)?.name || '',
    Hall: hallsList.find(h => h.id === schedule.hallsId)?.name || '',
    Location: locationsList.find(l => l.id === schedule.locationId)?.name || '',
    Department: departmentsList.find(d => d.id === schedule.departmentId)?.name || '',
    IsCanceled: schedule.isCanceled ? 'Yes' : 'No'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ManualSchedules");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'ManualSchedules.xlsx');
};


  // Funksion për filtrim
  

    const sortedSchedules = schedules.slice().sort((a, b) => 
    {
        const dayComparison = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
        if (dayComparison !== 0) return dayComparison;

        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
        return 0;
    });
    const filteredSchedules = sortedSchedules.filter(schedule => {
    if (filterDay && schedule.day !== filterDay) return false;
    if (filterCourseLecture && schedule.courseLecturesId !== filterCourseLecture) return false;
    if (filterGroup && schedule.groupId !== filterGroup) return false;
    if (filterHall && schedule.hallsId !== filterHall) return false;
    if (filterLocation && schedule.locationId !== filterLocation) return false;
    if (filterDepartment && schedule.departmentId !== filterDepartment) return false;
    if (filterIsCanceled !== null && schedule.isCanceled !== filterIsCanceled) return false;
    return true;
  });
    useEffect(() => {
        const fetchData = async () => {
            const result = await ManualScheduleService.getAllManualSchedulesAsync();
            setSchedules(result);
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
    function deleteSchedule(id: string)
    {
        setOpenConfirm(true);
        setDeletedScheduleId(id);
    }
    async function confirmToDelete(id: string)
        {
            await ManualScheduleService.deleteManualScheduleAsync(id);
            setSchedules(schedules.filter((s) => s.id !== id));
            setOpenConfirm(false);
            setDeletedScheduleId("");
        }

    return (
        <Fragment>
             <div className="filters-container" style={{ margin: "20px" }}>
        <select onChange={e => setFilterDay(e.target.value)} value={filterDay}>
          <option value="">All Days</option>
          {daysOrder.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <select onChange={e => setFilterCourseLecture(e.target.value)} value={filterCourseLecture}>
          <option value="">All Lectures</option>
          {courseLecturesList.map(c => (
            <option key={c.id} value={c.id?? ''}>{c.name}</option>
          ))}
        </select>

        <select onChange={e => setFilterGroup(e.target.value)} value={filterGroup}>
          <option value="">All Groups</option>
          {groupsList.map(g => (
            <option key={g.id} value={g.id?? ''}>{g.name}</option>
          ))}
        </select>

        <select onChange={e => setFilterHall(e.target.value)} value={filterHall}>
          <option value="">All Halls</option>
          {hallsList.map(h => (
            <option key={h.id} value={h.id ?? ''}>{h.name}</option>
          ))}
        </select>

        <select onChange={e => setFilterLocation(e.target.value)} value={filterLocation}>
          <option value="">All Locations</option>
          {locationsList.map(l => (
            <option key={l.id} value={l.id?? ''}>{l.name}</option>
          ))}
        </select>

        <select onChange={e => setFilterDepartment(e.target.value)} value={filterDepartment}>
          <option value="">All Departments</option>
          {departmentsList.map(d => (
            <option key={d.id} value={d.id ?? ''}>{d.name}</option>
          ))}
        </select>

        <label>
          <input 
            type="checkbox" 
            checked={filterIsCanceled ?? false} 
            onChange={e => setFilterIsCanceled(e.target.checked ? true : null)} 
          /> Show only canceled
        </label>
      </div>
            <div className="table-container my-4">
                <div className="d-flex align-items-center justify-content-between">
                    <h1 style={{ marginLeft: "30px"}}>Manual Schedules</h1>
                        <Button type="button" style={{ backgroundColor: "#34495e", color: "white" }}
                            className="ms-auto" 
                            onClick={() => navigate('/CreateManualSchedule')}> 
                            Add New Manual Schedule 
                        </Button>
                        <Button type="button"
        style={{ backgroundColor: "#27ae60", color: "white", marginLeft: "10px" }}
        onClick={exportToExcel}>
  Export to Excel
</Button>
                </div>   
                <div className="table-responsive mt-4">
                    <Table size="small" compact="very" celled style={{ fontSize: "0.8rem", borderTop: "2px solid navy" }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Lecture</Table.HeaderCell>
                                <Table.HeaderCell>Day</Table.HeaderCell>
                                <Table.HeaderCell>Start</Table.HeaderCell>
                                <Table.HeaderCell>End</Table.HeaderCell>
                                <Table.HeaderCell>Group</Table.HeaderCell>
                                <Table.HeaderCell>Hall</Table.HeaderCell>
                                <Table.HeaderCell>Location</Table.HeaderCell>
                                <Table.HeaderCell>Department</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filteredSchedules.map(schedule => (
                                <Table.Row key={schedule.id}>
                                    <Table.Cell>
                                        {courseLecturesList.find(c => c.id === schedule.courseLecturesId)?.name}</Table.Cell>
                                    <Table.Cell >{schedule.day}</Table.Cell>
                                    <Table.Cell >{schedule.startTime}</Table.Cell>
                                    <Table.Cell >{schedule.endTime}</Table.Cell>
                                    <Table.Cell >{groupsList.find(g => g.id === schedule.groupId)?.name}</Table.Cell>
                                    <Table.Cell >{hallsList.find(h => h.id === schedule.hallsId)?.name}</Table.Cell>
                                    <Table.Cell >{locationsList.find(l => l.id === schedule.locationId)?.name}</Table.Cell>
                                    <Table.Cell >{departmentsList.find(d => d.id === schedule.departmentId)?.name}</Table.Cell>
                                    <Table.Cell>
                                        <div style={{display: 'flex', flexDirection: 'column' }}>
                                            <Button size="mini" style={{ backgroundColor: "#34495e", color: "white"}} className="mr-2" onClick={() => navigate(`/EditManualSchedule/${schedule.id}`)}>
                                                Edit
                                            </Button>
                                            <Button size="mini" color="red" className="mr-2" onClick={() => deleteSchedule(schedule.id!)} style={{marginTop: '3%'}}>
                                                Del
                                            </Button>
                                        </div>
                                        
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            <Modal open={openConfirm}
                                size="mini"
                                onClose={() => setOpenConfirm(false)}
                                closeOnEscape={false}
                                closeOnDimmerClick={false}
                                style={{minHeight: 'unset',
                                        height: 'auto',
                                        padding: '1rem',
                                        textAlign: 'center',
                                        position: 'fixed',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 1000}}>
                            <Modal.Content>Are you sure you want to delete this schedule?</Modal.Content>
                            <Modal.Actions style={{ justifyContent: 'center', display: 'flex', gap: '1rem' }}>
                                <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
                                <Button color="red" onClick={() => confirmToDelete(deletedScheduleId)}>Delete</Button>
                            </Modal.Actions>
                        </Modal>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </Fragment>
    );
}

