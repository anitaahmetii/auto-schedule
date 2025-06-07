import { Fragment, useEffect, useState } from "react";
import { Button, Input, Label, Modal, Table } from "semantic-ui-react";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { AttendanceModel } from "../../Interfaces/AttendanceModel";
import { ManualScheduleService } from "../../Services/ManualScheduleService";
import { CourseLecturesService } from "../../Services/CourseLecturesService";
import { GroupService } from "../../Services/GroupService";
import { HallService } from "../../Services/HallService";
import { LocationService } from "../../Services/LocationService";
import AttendanceService from "../../Services/AttendanceService";


export default function DailySchedule()
{
    const [studentId, setStudentId] = useState<string | null>(null);
    // const [userRole, setUserRole] = useState<string | null>(null);
    const [dailyschedules, setDailySchedules] = useState<ManualScheduleModel[]>([]);
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name}))
    const[courseLecture, setCourseLecture] = useState<SelectListItem[]>([]);
    const[group, setGroup] = useState<SelectListItem[]>([]);
    const[hall, setHall] = useState<SelectListItem[]>([]);
    const[location, setLocation] = useState<SelectListItem[]>([]);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [codeInput, setCodeInput] = useState<string>("");
    const [attendances, setAttendances] = useState<AttendanceModel[]>([]);
    const [error, setError] = useState<boolean>(false);


    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        const storedStudentId = localStorage.getItem("studentId");
        if (storedRole && storedStudentId)
        {
            // setUserRole(storedRole);
            setStudentId(storedStudentId)
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
    function handleCode(scheduleId: string, studentId: string)
    {
        setSelectedScheduleId(scheduleId);
        setSelectedStudentId(studentId);
        setOpenConfirm(true);
    };
    async function handleConfirm()
    {
        const presence = await AttendanceService.confirmPresenceAsync(selectedStudentId!, selectedScheduleId!, codeInput!);
        if (presence)
        {
            setOpenConfirm(false);
            setCodeInput("");
        }
        else 
        {
            setError(true);
        }
        
    }
    useEffect(() => {
        if (!studentId) return;
        const fetchAttendances = async () => {
            const data = await AttendanceService.getAttendancesAsync(studentId);
            setAttendances(data);
        };
        fetchAttendances();
    }, [studentId]);
    return (
        <Fragment>
            <div className="d-flex justify-content-center align-items-center flex-column" style={{paddingTop: '2%', }}>
                <h1 style={{ marginBottom: '20px', fontWeight: 'bold', wordSpacing: '2px' }}>Daily Schedule</h1>
                <div className={`ui segment pt-3 px-1 ${(!dailyschedules || dailyschedules.length === 0) ? "disabled" : ""}`} 
                    style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
                    <Table className={`ui striped  compact celled table`} style={{ borderTop: '2px solid navy'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Day</Table.HeaderCell>
                                <Table.HeaderCell>Start Time</Table.HeaderCell>
                                <Table.HeaderCell>End Time</Table.HeaderCell>
                                <Table.HeaderCell>Course Lecture</Table.HeaderCell>
                                <Table.HeaderCell>Group</Table.HeaderCell>
                                <Table.HeaderCell>Hall</Table.HeaderCell>
                                <Table.HeaderCell>Location</Table.HeaderCell>
                                <Table.HeaderCell>Evidence</Table.HeaderCell>
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
                                        <Table.Cell>
                                            {attendances.find(x => x.scheduleId === item.id) ? (
                                                <Label color="blue">Confirmed</Label>
                                            ) : (
                                                <Button style={{ backgroundColor: "#34495e", color: 'white'}} onClick={() => handleCode(item.id!, studentId!)}>
                                                    Code
                                                </Button>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                <Modal  open={openConfirm}
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
                                    <Modal.Header>Confirm Your Presence</Modal.Header>
                                    {error && 
                                        <Modal.Description style={{ marginTop: '10px', color: 'red' }}>
                                            The code has not been set up yet or you wrote the wrong code!
                                        </Modal.Description>
                                    }
                                    <Modal.Content>
                                        <Input
                                            fluid
                                            placeholder="Write your code here..."
                                            value={codeInput}
                                            onChange={(e) => setCodeInput(e.target.value)} 
                                            />
                                    </Modal.Content>
                                    <Modal.Actions style={{ justifyContent: 'center', display: 'flex', gap: '1rem' }}>
                                        <Button onClick={() => { setOpenConfirm(false); setCodeInput(""); setError(false); }}>Cancel</Button>
                                        <Button color="olive" onClick={handleConfirm}>Confirm</Button>
                                    </Modal.Actions>
                                </Modal>
                            </Table.Body> } 
                    </Table>
                </div>
            </div>
        </Fragment>
    );
}