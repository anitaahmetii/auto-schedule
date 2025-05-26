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
    const styleWidth = {maxWidth: "120px", whiteSpace: "normal", wordWrap: "break-word" };
    return (
        <Fragment>
            <div className="d-flex align-items-center mt-4 mb-3 px-4">
                <h1 style={{ marginLeft: "30px"}}>Manual Schedules</h1>
                <Button type="button" style={{color: "white"}} color="olive" 
                        className="ms-auto" 
                        onClick={() => navigate('/CreateManualSchedule')}> Add New Manual Schedule </Button>
            </div>   
            <div className="px-2">
                <Table className="ui olive striped  single line table" >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Course Lecture</Table.HeaderCell>
                            <Table.HeaderCell>Day</Table.HeaderCell>
                            <Table.HeaderCell>Start Time</Table.HeaderCell>
                            <Table.HeaderCell>End Time</Table.HeaderCell>
                            <Table.HeaderCell>Group</Table.HeaderCell>
                            <Table.HeaderCell>Hall</Table.HeaderCell>
                            <Table.HeaderCell>Location</Table.HeaderCell>
                            <Table.HeaderCell>Department</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {schedules.map(schedule => (
                            <Table.Row key={schedule.id}>
                                <Table.Cell style={{...styleWidth, maxWidth: "250px"}}>
                                    {courseLecturesList.find(c => c.id === schedule.courseLecturesId)?.name}</Table.Cell>
                                <Table.Cell style={styleWidth}>{schedule.day}</Table.Cell>
                                <Table.Cell style={styleWidth}>{schedule.startTime}</Table.Cell>
                                <Table.Cell style={styleWidth}>{schedule.endTime}</Table.Cell>
                                <Table.Cell style={styleWidth}>{groupsList.find(g => g.id === schedule.groupId)?.name}</Table.Cell>
                                <Table.Cell style={styleWidth}>{hallsList.find(h => h.id === schedule.hallsId)?.name}</Table.Cell>
                                <Table.Cell style={styleWidth}>{locationsList.find(l => l.id === schedule.locationId)?.name}</Table.Cell>
                                <Table.Cell style={styleWidth}>{departmentsList.find(d => d.id === schedule.departmentId)?.name}</Table.Cell>
                                <Table.Cell>
                                    <Button color="olive" className="mr-2" onClick={() => navigate(`/EditManualSchedule/${schedule.id}`)}>Edit</Button>
                                    <Button color="red" className="mr-2" onClick={() => deleteSchedule(schedule.id!)}>Del</Button>
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
        </Fragment>
    );
}