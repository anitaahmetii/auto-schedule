import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { ManualScheduleService } from "../../Services/ManualScheduleService";
import { Button, Form, Header } from "semantic-ui-react";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { CourseLecturesService } from "../../Services/CourseLecturesService";
import { HallService } from "../../Services/HallService";
import { LocationService } from "../../Services/LocationService";
import { DepartmentService } from "../../Services/DepartmentService";
import { GroupService } from "../../Services/GroupService";

export default function EditManualSchedule()
{
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState<ManualScheduleModel>({
        id: null,
        day: "",
        startTime: "",
        endTime: "",
        courseLecturesId: "",
        hallsId: "",
        locationId: "",
        departmentId: "",
        groupId: "",
        hasReport: "",
        isCanceled: ""
    });
    // const [courseLecture, setCourseLecture] = useState<SelectListItem[]>([]);
    const mapToSelect = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name }));
    const [courseLecturesList, setCourseLecturesList] = useState<SelectListItem[]>([]);
    const [hallsList, setHallsList] = useState<SelectListItem[]>([]);
    const [locationsList, setLocationsList] = useState<SelectListItem[]>([]);
    const [departmentsList, setDepartmentsList] = useState<SelectListItem[]>([]);
    const [groupsList, setGroupsList] = useState<SelectListItem[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const scheduleById = await ManualScheduleService.getByIdManualScheduleAsync(id!);
            setSchedule(scheduleById);
        };
        fetchData();
    }, [id]);
    useEffect(() => {
        let fetched = false;
        const fetchData = async () => {
            try
            {
                const [cLR, hR, lR, dR, gR] = await Promise.all([
                    CourseLecturesService.GetSelectList(),
                    HallService.GetSelectList(),
                    LocationService.GetSelectList(),
                    DepartmentService.GetSelectList(),
                    GroupService.GetSelectList()
                ]);
                if (!fetched)
                {
                    setCourseLecturesList(mapToSelect(cLR));
                    setHallsList(mapToSelect(hR));
                    setLocationsList(mapToSelect(lR));
                    setDepartmentsList(mapToSelect(dR));
                    setGroupsList(mapToSelect(gR));
                }
            }
            catch (err) 
            {
                console.error("Lists could not be uploaded!", err);
            }
        };
        fetchData();
        return () => {
            fetched = true;
        };
    }, []);
    const dayOptions = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
    {
        const { name, value } = e.target;
        setSchedule({ ...schedule, [name]: value });
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => 
    {
        e.preventDefault();
        try 
        {
            await ManualScheduleService.updateManualScheduleAsync(schedule);
            navigate(`/ManualSchedule`);
            console.log("Manual Schedule updated successfully!");
        } catch (error) 
        {
            console.error("Error updating schedule:", error);
        }
    } 
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const courseLectureById = await CourseLecturesService.GetSelectList();
    //         const result = courseLectureById.map((c, i) => ({
    //                             key: i,
    //                             value: c.id,
    //                             text: c.name
    //                         }));
    //         setCourseLecture(result);
    //     };
    //     fetchData();
    // }, []);
    return (
        <Fragment>
             <div className="d-flex justify-content-center align-items-center mt-4 mb-3 px-4">
                <Header as="h1">Edit Manual Schedule</Header>
            </div>
            <div className="px-4 d-flex justify-content-center align-items-center">
                <div className="ui segment" style={{ padding: "1.5rem" }}>
                    <Form className="ui form" onSubmit={(e) => handleSubmit(e)}>
                        <div className="fields" style={{ marginBottom: "1rem", display: "flex", gap: "1rem",}}>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Day</label>
                                <select name="day" className="ui dropdown"style={{ width: "100%", height: "38px" }}
                                    value={schedule.day} onChange={(e) => handleChange(e)}>
                                    <option value="" disabled>Select Day</option>
                                    {dayOptions.map(d => (
                                        <option>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Start Time</label>
                                <input type="time" placeholder="Start Time" style={{ width: "100%", height: "38px" }} 
                                    name="startTime" value={schedule.startTime} onChange={(e) => handleChange(e)}/>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>End Time</label>
                                <input type="time" placeholder="End Time" style={{ width: "100%", height: "38px" }} 
                                    name="endTime" value={schedule.endTime} onChange={(e) => handleChange(e)}/>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Course Lecture</label>
                                <select name="courseLecturesId"className="ui dropdown" style={{ width: "100%", height: "38px" }} 
                                    value={schedule.courseLecturesId} onChange={(e) => handleChange(e)}>
                                    <option value="" disabled>Select Course-Lecture</option>
                                    {courseLecturesList.map(c => (
                                        <option key={c.key} value={c.value!}>{ c.text }</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="fields" style={{ display: "flex", gap: "1rem",}}>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Halls</label>
                                <select name="hallsId" className="ui dropdown" style={{ width: "100%", height: "38px" }} 
                                        value={schedule.hallsId} onChange={(e) => handleChange(e)}>
                                        <option value="" disabled>Select Hall</option>
                                        {hallsList.map(h => (
                                            <option key={h.key} value={h.value!}>{ h.text }</option>
                                        ))}
                                </select>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Location</label>
                                <select name="locationId" className="ui dropdown" style={{ width: "100%", height: "38px" }} 
                                        value={schedule.locationId} onChange={(e) => handleChange(e)}>
                                        <option value="" disabled>Select Location</option>
                                        {locationsList.map(l => (
                                            <option key={l.key} value={l.value!}>{ l.text }</option>
                                        ))}
                                </select>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Department</label>
                                <select name="departmentId" className="ui dropdown" style={{ width: "100%", height: "38px" }} 
                                       value={schedule.departmentId} onChange={(e) => handleChange(e)}>
                                        <option value="" disabled>Department</option>
                                        {departmentsList.map(d => (
                                            <option key={d.key} value={d.value!}>{ d.text }</option>
                                        ))}
                                </select>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Group</label>
                                <select name="groupId" className="ui dropdown" style={{ width: "100%", height: "38px" }}
                                        value={schedule.groupId} onChange={(e) => handleChange(e)}>
                                        <option value="" disabled>Select Group</option>
                                        {groupsList.map(g => (
                                            <option key={g.key} value={g.value!}>{ g.text }</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center" style={{ marginTop: "5%" }} >
                            <Button color="grey" type="submit" onClick={() => navigate(`/ManualSchedule`)}>Cancel</Button>
                            <Button color="olive" type="submit">Update</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Fragment>
    );
}