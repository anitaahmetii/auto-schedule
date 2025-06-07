import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Button, Divider, Form, Header } from "semantic-ui-react";
import { CourseLecturesService } from "../../Services/CourseLecturesService";
import { useEffect, useState } from "react";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { HallService } from "../../Services/HallService";
import { LocationService } from "../../Services/LocationService";
import { DepartmentService } from "../../Services/DepartmentService";
import { GroupService } from "../../Services/GroupService";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { ManualScheduleService } from "../../Services/ManualScheduleService";
import React, { useRef } from 'react';

export default function CreateManualSchedule()
{
    const navigate = useNavigate();
    const [manualSchedule, setManualSchedule] = useState<ManualScheduleModel>({
        id: null,
        day: "",
        startTime: "",
        endTime: "",
        courseLecturesId: "",
        hallsId: "",
        locationId: "",
        departmentId: "",
        groupId: "",
        hasReport: false,
        isCanceled: false
    });
    const mapToSelect = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name }));
    const [courseLecturesList, setCourseLecturesList] = useState<SelectListItem[]>([]);
    const [hallsList, setHallsList] = useState<SelectListItem[]>([]);
    const [locationsList, setLocationsList] = useState<SelectListItem[]>([]);
    const [departmentsList, setDepartmentsList] = useState<SelectListItem[]>([]);
    const [groupsList, setGroupsList] = useState<SelectListItem[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const dayOptions = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    useEffect(() => {
        let cancelled = false;

        const fetchAll = async () => {
            try 
            {
                const [courseLecturesRes, hallRes, locationRes, departmentRes, groupRes] = await Promise.all([
                    CourseLecturesService.GetSelectList(),
                    HallService.GetSelectList(),
                    LocationService.GetSelectList(),
                    DepartmentService.GetSelectList(),
                    GroupService.GetSelectList(),
                ]);
                if (!cancelled) 
                {
                    setCourseLecturesList(mapToSelect(courseLecturesRes));
                    setHallsList(mapToSelect(hallRes));
                    setLocationsList(mapToSelect(locationRes));
                    setDepartmentsList(mapToSelect(departmentRes));
                    setGroupsList(mapToSelect(groupRes));
                }
            } 
            catch (err) 
            {
                console.error("Lists could not be loaded!", err);
            }
        };
        fetchAll();
        return () => {
            cancelled = true;                   
        };
    }, [])
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
    {
        const { name, value } = e.target;
        setManualSchedule({ ...manualSchedule, [name]: value });
        console.log(manualSchedule);
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => 
    {
        e.preventDefault();
        try {
        await ManualScheduleService.createManualScheduleAsync(manualSchedule);
        navigate(`/ManualSchedule`);
        console.log("Manual Schedule created successfully!");
        } catch (error) {
        console.error("Error creating the schedule:", error);
        }
    } 
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => 
    {
        const selected = e.target.files?.[0];
        if (!selected) return;
        try {
            await ManualScheduleService.ImportSchedule(selected);
            navigate(`/ManualSchedule`);
            // console.log("Orari u importua me sukses!");
        } catch (err) {
            console.error("The schedule could not be imported!", err);
        }
    }
    return (
        <Fragment>
            <div className="d-flex justify-content-center align-items-center mt-4 mb-3 px-4">
                <Header as="h1">Create Manual Schedule</Header>
            </div>
            <div className="px-4 d-flex justify-content-center align-items-center">
                <div className="ui segment" style={{ padding: "1.5rem" }}>
                    <Form className="ui form" onSubmit={handleSubmit}>
                        <div className="fields" style={{ marginBottom: "1rem",
                                                        display: "flex",
                                                        gap: "1rem",}} >
                            <div className="field" style={{ flex: 1 }}>
                                <label>Day</label>
                                <select name="day" className="ui dropdown"style={{ width: "100%", height: "38px" }}
                                        value={manualSchedule.day} onChange={(e) => handleChange(e)}>
                                    <option value="" disabled>Select Day</option>
                                    {dayOptions.map((day) => (
                                        <option key={day} value={day}> {day} </option>
                                    ))}
                                </select>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Start Time</label>
                                <input type="time" placeholder="Start Time" style={{ width: "100%", height: "38px" }} 
                                        name="startTime" value={manualSchedule.startTime} onChange={(e) => handleChange(e)}/>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>End Time</label>
                                <input type="time" placeholder="End Time" style={{ width: "100%", height: "38px" }} 
                                        name="endTime" value={manualSchedule.endTime} onChange={(e) => handleChange(e)}/>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Course Lecture</label>
                                <select name="courseLecturesId"className="ui dropdown" style={{ width: "100%", height: "38px" }} 
                                        value={manualSchedule.courseLecturesId} onChange={(e) => handleChange(e)}>
                                    <option value="" disabled>Select Course-Lecture</option>
                                    {courseLecturesList.map((c) => (
                                        <option key={c.key} value={c.value!}> {c.text} </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="fields" style={{ display: "flex", gap: "1rem",}} >
                            <div className="field" style={{ flex: 1 }}>
                                <label>Halls</label>
                                <select name="hallsId" className="ui dropdown" style={{ width: "100%", height: "38px" }} 
                                        value={manualSchedule.hallsId} onChange={(e) => handleChange(e)}>
                                        <option value="" disabled>Select Hall</option>
                                    {hallsList.map((h) => (
                                        <option key={h.key} value={h.value!}> {h.text} </option>
                                    ))}
                                </select>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Location</label>
                                <select name="locationId" className="ui dropdown" style={{ width: "100%", height: "38px" }} 
                                        value={manualSchedule.locationId} onChange={(e) => handleChange(e)}>
                                        <option value="" disabled>Select Location</option>
                                    {locationsList.map((l) => (
                                        <option key={l.key} value={l.value!}> {l.text} </option>
                                    ))}
                                </select>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Department</label>
                                <select name="departmentId" className="ui dropdown" style={{ width: "100%", height: "38px" }} 
                                        value={manualSchedule.departmentId} onChange={(e) => handleChange(e)}>
                                        <option value="" disabled>Department</option>
                                    {departmentsList.map((d) => (
                                        <option key={d.key} value={d.value!}> {d.text} </option>
                                    ))}
                                </select>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Group</label>
                                <select name="groupId" className="ui dropdown" style={{ width: "100%", height: "38px" }}
                                        value={manualSchedule.groupId} onChange={(e) => handleChange(e)}>
                                        <option value="" disabled>Select Group</option>
                                    {groupsList.map((g) => (
                                        <option key={g.key} value={g.value!}> {g.text} </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center" style={{ marginTop: "5%", marginLeft: "1%" }} >
                            <Button color="grey" type="submit" onClick={() => navigate(`/ManualSchedule`)}>Cancel</Button>
                            <Button color="olive" type="submit">Create</Button>
                        </div>
                    </Form>
                    <Divider style={{marginTop: '5%'}} />
                    <div className="d-flex align-items-center gap-3" style={{ marginTop: "2rem", marginLeft: '0%'}} >
                        {/* <Header as="h2">Import Schedule</Header>
                        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange}/> */}
                        <Button color="grey" onClick={() => fileInputRef.current?.click()} style={{fontSize: '15px', marginLeft: '35%'}}> 
                            Upload Schedule 
                        </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept=".csv, .xlsx"
                                onChange={handleFileChange}
                            />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}