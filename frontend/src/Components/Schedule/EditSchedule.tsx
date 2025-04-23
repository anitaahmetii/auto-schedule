import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { DepartmentModel } from '../../Interfaces/DepartmentModel';
import { DepartmentService } from '../../Services/DepartmentService';
import { ScheduleModel } from '../../Interfaces/ScheduleModel';
import { ScheduleService } from '../../Services/ScheduleService';

export default function EditSchedule() {
  const { id } = useParams<{ id: string}>();
  const [values, setValues] = useState<ScheduleModel>({
    id:id!,
    day:'',
    startTime:'',
    endTime:'',
    // hall:'',
    location:'',
    department:'',
    group:'',
  } as ScheduleModel);

  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if(id!=null){
     const response = await ScheduleService.GetScheduleDetails(id!);
     const data = response;
     setValues({
       id: data.id,
       day: data.day,
       startTime:data.startTime,
       endTime:data.endTime,
    //    hall: data.hall,
       location: data.location,
       department:data.department,
    //    group:data.group
     }as ScheduleModel);
    }
  };
  
  fetchData();

}, [id!]);
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
//     let model = {
//       id: values.id!,
//       name: values.name,
//       code: values.code,
//     } as DepartmentModel;

    await ScheduleService.UpdateSchedule(values);
    
    setSchedule(true);
    sendToOverview();
  } catch (error) {
    console.error("Error creating state:", error);
  }
};
function sendToOverview(){
  navigate('/ScheduleTable');
 }
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target;
  setValues({ ...values, [name]: value });
};
  return (
    <>  
    <h1 style={{ marginLeft: "15px", fontFamily: "Georgia", color: "black" }}>
        Edit Schedule
      </h1>
      <p style={{ marginLeft: "15px", color: "#555", fontSize: "14px" }}>
        Please fill out the form below to edit a Schedule.
      </p>
      <Segment clearing style={{ margin: "30px 30px 0 10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", border: "1px solid rgb(15 179 126 / 87%)" }}>
    <form className='ui form' style={{ backgroundColor: "#f9f9f9", padding: "20px" }} onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
        <label>Day</label>
          <input
            style={{ padding: "5px", margin: "5px" }}
            type="text"
            placeholder="Day"
            className="form-control"
            id="day"
            name="day"
            value={values.day!}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
        <label>Start Time</label>
          <input
            style={{ padding: "5px", margin: "5px" }}
            type="text"
            placeholder=" Start Time"
            className="form-control"
            id="startTime"
            name="startTime"
            value={values.startTime!}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
        <label>End Time</label>
          <input
            style={{ padding: "5px", margin: "5px" }}
            type="text"
            placeholder="End Time"
            className="form-control"
            id="endTime"
            name="endTime"
            value={values.endTime!}
            onChange={handleChange}
          />
        </div>
        {/* <div className="form-group">
        <label>Hall</label>
          <input
            style={{ padding: "5px", margin: "5px" }}
            type="text"
            placeholder="Hall"
            className="form-control"
            id="hall"
            name="hall"
            value={values.hall!}
            onChange={handleChange}
          />
        </div> */}
        <div className="form-group">
        <label>Location</label>
          <input
            style={{ padding: "5px", margin: "5px" }}
            type="text"
            placeholder="Location"
            className="form-control"
            id="location"
            name="location"
            value={values.location!}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
        <label>Department</label>
          <input
            style={{ padding: "5px", margin: "5px" }}
            type="text"
            placeholder="Department"
            className="form-control"
            id="department"
            name="department"
            value={values.department!}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
        {/* <label>Group</label>
          <input
            style={{ padding: "5px", margin: "5px" }}
            type="text"
            placeholder="Group"
            className="form-control"
            id="group"
            name="group"
            value={values.group!}
            onChange={handleChange}
          /> */}
        </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
          <button
          type="submit"
           onClick={sendToOverview}
           className="ui blue basic button"
          style={{ backgroundColor: "rgb(32 76 60)", color: "#fff" }}
          >
          Cancel
        </button>
        <button
          type="submit"
          className="ui green button"
          style={{ backgroundColor: "rgb(32 76 60)", color: "#fff" }}
        >
          Submit
        </button>
        </div>
      </form>
      </Segment>
      <br/>
      <br/>
    </>
  );
}