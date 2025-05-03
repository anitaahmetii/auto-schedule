import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { SelectListItem } from '../../Interfaces/SelectListItem';
import { getUserIdFromToken } from './../../auth';
import { LecturesModel } from '../../Interfaces/LecturesModel';
import { LecturesService } from '../../Services/LecturesService';
import { LectureType } from '../../Interfaces/LectureType';
import { ScheduleTypeService } from '../../Services/ScheduleTypeService';

export default function EditLectures() {
  const { id } = useParams<{ id: string}>();
  const [scheduleTypeList, setScheduleTypeList] = useState<SelectListItem[]>([]);
  const userId = getUserIdFromToken();
  const [values, setValues] = useState<LecturesModel>({
    id:id!,
    academicGrade: '',
    lectureType: '',
    scheduleTypeId: '',
    userId: userId,
  } as LecturesModel);

  const navigate = useNavigate();
  const [lectures, setLectures] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if(id!=null){
     const response = await LecturesService.GetLecturesDetails(id!);
     const userData = response;
     setValues({
       id: userData.id,
       academicGrade: userData.academicGrade,
       lectureType: userData.lectureType,
       scheduleTypeId: userData.scheduleTypeId,
       userId: userId,
     }as LecturesModel);
    }
  };
  
  fetchData();

}, [id!]);

const fetchScheduleTypeList = async () => {
  const response = await ScheduleTypeService.GetSelectList();

  console.log(response);
  setScheduleTypeList(response.map((item,i)=>({
    key: i,
    value: item.id,
    text: item.scheduleTypes,
  } as SelectListItem)).filter(x=>x.text != '' &&x.text != null));


}
useEffect(() => {
    fetchScheduleTypeList();
}, []);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    let model = {
      id: values.id!,
      academicGrade: values.academicGrade,
      lectureType: values.lectureType,
      scheduleTypeId:values.scheduleTypeId,
      userId: userId,
    } as LecturesModel;

    const response = await axios.post(
      "https://localhost:7085/api/Lectures",
      model
    );
    setLectures(true);
    sendToOverview();
  } catch (error) {
    console.error("Error creating Lecturer:", error);
  }
};
function sendToOverview(){
  navigate('/lectures');
 }
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target;
  setValues({ ...values, [name]: value });
};
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  setValues({ ...values, [name]: value });
};
  return (
    <>  
    <h1 style={{ marginLeft: "15px", fontFamily: "Georgia", color: "black" }}>
        {values.id != null ? 'Edit' : 'Add'} Lecturer
      </h1>
      <p style={{ marginLeft: "15px", color: "#555", fontSize: "14px" }}>
        Please fill out the form below to {values.id != null ? 'edit' : 'create'} a Lecturer.
      </p>
      <Segment clearing style={{ margin: "30px 30px 0 10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", border: "1px solid rgb(15 179 126 / 87%)" }}>
    <form className='ui form' style={{ backgroundColor: "#f9f9f9", padding: "20px" }} onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
            <label>Academic Grade</label>
          <input
            style={{ padding: "5px", margin: "5px" }}
            type="text"
            placeholder="Academic Grade"
            className="form-control"
            id="academicGrade"
            name="academicGrade"
            value={values.academicGrade!}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6-w-100%">
            <select className="form-control"
                name="lectureType" 
                id="lectureType"
                value= {values.lectureType || ""}
                onChange={handleSelectChange}
                style={{ marginBottom: "15px"}}
                >
                  <option value="" disabled>Select Lecture Type</option>
                  {Object.entries(LectureType)
                    .filter(([key, value]) => !isNaN(Number(value)))
                    .map(([key, value]) => (
                    <option key={value} value={value}>
                    {key}
                    </option>
                    ))}
            </select>
        </div>
        <div className="form-group">
            <label>Userid</label>
          <input
            style={{ padding: "5px", margin: "5px" }}
            type="text"
            placeholder="User"
            className="form-control"
            id="userId"
            name="userId"
            value={values.userId!}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6-w-100%">
              <select className="form-control"
                name="scheduleTypeId" 
                id="scheduleTypeId"
                value= {values.scheduleTypeId || ""}
                onChange={handleSelectChange}
                style={{ marginBottom: "15px"}}
                >
                  <option value="" disabled>Select ScheduleTypeId</option>
                  {scheduleTypeList.map((x) => (
                    <option key={x.key} value={x.value!}>{x.text}</option>
                  ))}
                </select>
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
