import  { Fragment, useEffect, useState } from "react";
import { Table } from "semantic-ui-react";
import { AttendanceModel } from "../../Interfaces/AttendanceModel";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { CourseLecturesService } from "../../Services/CourseLecturesService";
import { GroupService } from "../../Services/GroupService";
import { HallService } from "../../Services/HallService";
import { LocationService } from "../../Services/LocationService";
import AttedanceService from "../../Services/AttendanceService";
import { ManualScheduleService } from "../../Services/ManualScheduleService";


export default function MyAttendances()
{
    const [studentId, setStudentId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [studentAttendances, setStudentAttendances] = useState<AttendanceModel[]>([]);
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name}))
    const[courseLecture, setCourseLecture] = useState<SelectListItem[]>([]);
    const[group, setGroup] = useState<SelectListItem[]>([]);
    const[hall, setHall] = useState<SelectListItem[]>([]);
    const[location, setLocation] = useState<SelectListItem[]>([]);
    const [schedules, setSchedules] = useState<ManualScheduleModel[]>([]);
    
    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        const storedId= localStorage.getItem("studentId");
        if (storedRole && storedId)
        {
            setUserRole(storedRole);
            setStudentId(storedId);
        }
    }, []);
    useEffect(() => {
        let isFetched = false;
        const fetchData = async () => {
            try
            {
                const [courseLectureR, groupR, hallR, locationR, ] = await Promise.all([
                    CourseLecturesService.GetSelectList(),
                    GroupService.GetSelectList(),
                    HallService.GetSelectList(),
                    LocationService.GetSelectList(),
                ]);
                if (!isFetched)
                {
                    setCourseLecture(mapTo(courseLectureR));
                    setGroup(mapTo(groupR));
                    setHall(mapTo(hallR));
                    setLocation(mapTo(locationR));
                }
            }
            catch (err) 
            {
                console.error("Lists could not be uploaded!", err);
            }
        };
        fetchData();
        return () => {
            isFetched = true;
        };
    }, []);
    useEffect(() => {
        if (!studentId && userRole !== "Student") return;
        const fetchStudentAttendances = async () => {
            const data = await AttedanceService.getAttendancesAsync(studentId!);
            setStudentAttendances(data);
        };
        fetchStudentAttendances();
    }, [studentId, userRole]);
    useEffect(() => {
        const fetchSchedules = async () => {
            const data = await ManualScheduleService.getAllManualSchedulesAsync();
            setSchedules(data);
        };
        fetchSchedules();
    }, []);
    return (
        <Fragment>
            <div className="d-flex justify-content-center align-items-center flex-column" style={{ paddingTop: '1%' }}>
                <h1 style={{ marginBottom: '20px', fontWeight: 'bold', wordSpacing: '2px' }}>My Attendances</h1>
                <div className={`ui segment pt-3 px-1 ${(!studentAttendances || studentAttendances.length === 0) ? "disabled" : ""}`} 
                    style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
                   <Table celled style={{ width: '70vw',fontSize: "0.9rem", borderTop: "2px solid navy" }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Day</Table.HeaderCell>
                                <Table.HeaderCell>Start</Table.HeaderCell>
                                <Table.HeaderCell>End</Table.HeaderCell>
                                <Table.HeaderCell>Lecture</Table.HeaderCell>
                                <Table.HeaderCell>Group</Table.HeaderCell>
                                <Table.HeaderCell>Hall</Table.HeaderCell>
                                <Table.HeaderCell>Location</Table.HeaderCell>
                                <Table.HeaderCell>Confirmed</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {studentAttendances.map(s => (
                                <Table.Row key={s.id}>
                                    <Table.Cell>{schedules.find(x => x.id === s.scheduleId)?.day}</Table.Cell>
                                    <Table.Cell>{schedules.find(x => x.id === s.scheduleId)?.startTime}</Table.Cell>
                                    <Table.Cell>{schedules.find(x => x.id === s.scheduleId)?.endTime}</Table.Cell>
                                    <Table.Cell>{courseLecture.find(cl => 
                                        cl.value === schedules.find(x => x.id === s.scheduleId)?.courseLecturesId)?.text}                                 
                                    </Table.Cell>
                                    <Table.Cell>{group.find(g => 
                                        g.value === schedules.find(x => x.id === s.scheduleId)?.groupId)?.text}
                                    </Table.Cell>
                                    <Table.Cell>{hall.find(h => 
                                        h.value === schedules.find(x => x.id === s.scheduleId)?.hallsId)?.text}
                                    </Table.Cell>
                                    <Table.Cell>{location.find(l =>
                                        l.value === schedules.find(x => x.id === s.scheduleId)?.locationId)?.text}
                                    </Table.Cell>
                                    <Table.Cell style={{whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '150px' }}> 
                                        {new Date(s.confirmationTime!).toLocaleString()}
                                    </Table.Cell>
                            </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </Fragment>
    );
}