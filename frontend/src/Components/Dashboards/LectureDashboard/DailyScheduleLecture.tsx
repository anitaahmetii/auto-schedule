import { Fragment, useEffect, useState } from "react";
import { Button, Label, Table } from "semantic-ui-react";
import { ManualScheduleModel } from "../../../Interfaces/ManualScheduleModel";
import { ManualScheduleService } from "../../../Services/ManualScheduleService";
import { SelectListItem } from "../../../Interfaces/SelectListItem";
import { CourseLecturesService } from "../../../Services/CourseLecturesService";
import { GroupService } from "../../../Services/GroupService";
import { HallService } from "../../../Services/HallService";
import { LocationService } from "../../../Services/LocationService";
import AttendanceCodePeriodService from "../../../Services/AttendanceCodePeriodService";
import { AttendanceCodePeriodModel } from "../../../Interfaces/AttendanceCodePeriodModel";

export default function DailyScheduleLecture()
{
    const [lectureId, setLectureId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [dailyschedules, setDailySchedules] = useState<ManualScheduleModel[]>([]);
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name}))
    const [courseLecture, setCourseLecture] = useState<SelectListItem[]>([]);
    const [group, setGroup] = useState<SelectListItem[]>([]);
    const [hall, setHall] = useState<SelectListItem[]>([]);
    const [location, setLocation] = useState<SelectListItem[]>([]);
    const [code, setCode] = useState<AttendanceCodePeriodModel[]>([]);

    useEffect(() => {
        const storedLectureId = localStorage.getItem("lectureId");
        const storedRole = localStorage.getItem("userRole");
        
        if (storedLectureId && storedRole)
        {
            setLectureId(storedLectureId);
            setUserRole(storedRole);
        }
    }, []);
    useEffect(() => {
        const fetchDailySchedules = async () => {
            const data = await ManualScheduleService.getDailySchedules();
            const sortedData = data.sort((a, b) => {
                if (a.startTime < b.startTime) return -1;
                if (a.startTime > b.startTime) return 1;
                return 0;
            });
            setDailySchedules(sortedData);
        };
        fetchDailySchedules();
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
        const fetchCodes = async () => {
            const data = await AttendanceCodePeriodService.getAttendanceCodeAsync();
            setCode(data);
        };
        fetchCodes();
    }, []);
    async function handleClick(scheduleId: string)
    {
        await AttendanceCodePeriodService.createAttendanceCodePeriodAsync(scheduleId);
        const data = await AttendanceCodePeriodService.getAttendanceCodeAsync();
        setCode(data);
        setTimeout(async () => {
            await AttendanceCodePeriodService.deleteAttendanceCodePeriodAsync(scheduleId);
            setCode(prevCodes => prevCodes.filter(c => c.scheduleId !== scheduleId));
        }, 300000);
    };
    return (
        <Fragment>
            <div className="d-flex justify-content-center align-items-center flex-column" style={{paddingTop: '2%', }}>
                <h1 style={{ marginBottom: '20px', fontWeight: 'bold', wordSpacing: '2px' }}>Daily Schedule</h1>
                <div className={`ui segment pt-3 px-4 ${(!dailyschedules || dailyschedules.length === 0) ? "disabled" : ""}`} 
                    style={{  backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
                    <Table className={`ui striped olive compact celled table ${(dailyschedules && dailyschedules.length > 0) ? "olive" : ""}`} >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Day</Table.HeaderCell>
                                <Table.HeaderCell>Start Time</Table.HeaderCell>
                                <Table.HeaderCell>End Time</Table.HeaderCell>
                                <Table.HeaderCell>Course Lecture</Table.HeaderCell>
                                <Table.HeaderCell>Group</Table.HeaderCell>
                                <Table.HeaderCell>Hall</Table.HeaderCell>
                                <Table.HeaderCell>Location</Table.HeaderCell>
                                {lectureId && userRole === "Lecture" && (
                                    <Table.HeaderCell>Evidence</Table.HeaderCell>
                                )}
                            </Table.Row>
                        </Table.Header>
                         {(dailyschedules && dailyschedules.length > 0) &&
                            <Table.Body>
                                {dailyschedules.map(item => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.day}</Table.Cell>
                                        <Table.Cell>{item.startTime}</Table.Cell>
                                        <Table.Cell>{item.endTime}</Table.Cell>
                                        <Table.Cell>{courseLecture.find(c => c.value === item.courseLecturesId)?.text}</Table.Cell>
                                        <Table.Cell>{group.find(g => g.value === item.groupId)?.text}</Table.Cell>
                                        <Table.Cell>{hall.find(h => h.value === item.hallsId)?.text}</Table.Cell>
                                        <Table.Cell>{location.find(l => l.value === item.locationId)?.text}</Table.Cell>
                                        {lectureId && userRole === "Lecture" && (
                                            <Table.Cell>
                                                {code.find(c => c.scheduleId === item.id) ? (
                                                    <Label color="green" size="large">
                                                        {code.find(c => c.scheduleId === item.id)?.code}
                                                    </Label>
                                                ) : (
                                                    <Button color="olive" onClick={() => handleClick(item.id!)}>
                                                        Code
                                                    </Button>
                                                )}
                                            </Table.Cell> 
                                        )}
                                    </Table.Row>
                                ))}
                            </Table.Body> } 
                    </Table>
                </div>
            </div>
        </Fragment>
    );
}