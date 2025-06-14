import { Fragment } from "react/jsx-runtime";
import { Table } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { CourseLecturesService } from "../../Services/CourseLecturesService";
import { GroupService } from "../../Services/GroupService";
import { HallService } from "../../Services/HallService";
import { LocationService } from "../../Services/LocationService";


type ScheduleModel = {
    schedule: ManualScheduleModel[];
}

export default function ShowTable({ schedule }: ScheduleModel)
{
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name}))
    const[courseLecture, setCourseLecture] = useState<SelectListItem[]>([]);
    const[group, setGroup] = useState<SelectListItem[]>([]);
    const[hall, setHall] = useState<SelectListItem[]>([]);
    const[location, setLocation] = useState<SelectListItem[]>([]);
    
    useEffect(() => {
        let isFetched = false;
        const fetchData = async () => {
            try
            {
                const [courseLectureR, groupR, hallR, locationR] = await Promise.all([
                    CourseLecturesService.GetSelectList(),
                    GroupService.GetSelectList(),
                    HallService.GetSelectList(),
                    LocationService.GetSelectList()
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
    });
    return (
        <Fragment>
                <div className={`ui segment px-1 pt-3 pt-2 ${(!schedule || schedule.length === 0) ? "disabled" : ""}`} 
                 style={{ marginTop: '30px', backgroundColor: 'transparent', border: 'none', boxShadow: 'none'}}>
                        <Table className="ui striped compact very small single line table" celled 
                            style={{ borderTop: '2px solid navy', tableLayout: 'fixed', width: '100%', fontSize: '0.8rem'}}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Day</Table.HeaderCell>
                                    <Table.HeaderCell>Start Time</Table.HeaderCell>
                                    <Table.HeaderCell>End Time</Table.HeaderCell>
                                    <Table.HeaderCell>Lecture</Table.HeaderCell>
                                    <Table.HeaderCell>Group</Table.HeaderCell>
                                    <Table.HeaderCell>Hall</Table.HeaderCell>
                                    <Table.HeaderCell>Location</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header> 
                           {(schedule && schedule.length > 0) &&
                                <Table.Body>
                                    {schedule.map(item => (
                                        <Table.Row key={item.id}>
                                            <Table.Cell>{item.day}</Table.Cell>
                                            <Table.Cell>{item.startTime}</Table.Cell>
                                            <Table.Cell>{item.endTime}</Table.Cell>
                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                {courseLecture.find(c => c.value === item.courseLecturesId)?.text}
                                            </Table.Cell>
                                            <Table.Cell>{group.find(g => g.value === item.groupId)?.text}</Table.Cell>
                                            <Table.Cell>{hall.find(h => h.value === item.hallsId)?.text}</Table.Cell>
                                            <Table.Cell>{location.find(l => l.value === item.locationId)?.text}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body> }
                        </Table>
                    </div> 
        </Fragment>
    )
}