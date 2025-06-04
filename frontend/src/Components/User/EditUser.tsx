import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { UserModel } from '../../Interfaces/UserModel';
import { UserService } from '../../Services/UserService'; 
import { Role } from '../../Interfaces/Role';
import { LectureType } from '../../Interfaces/LectureType';
import { ScheduleTypeService } from '../../Services/ScheduleTypeService';
import { SelectListItem } from '../../Interfaces/SelectListItem';
import { GroupService } from '../../Services/GroupService';

export default function EditUser() {
  const { id } = useParams<{ id: string }>(); 
  const [scheduleTypeList, setScheduleTypeList] = useState<SelectListItem[]>([]);
  const [groupList, setGroupList] = useState<SelectListItem[]>([]);
  const [values, setValues] = useState<UserModel>({
    id: id!,
    userName: '',
    email: '',
    lastName: '',
    password: '',
    role: Role.Student, 
    responsibilities: '',
    status: '',
    academicGrade: '',
    lectureType: LectureType.Proffessor,
    scheduleTypeId: '',
    academicProgram: '',
    groupId: '',
  } as UserModel);

   useEffect(() => {
     fetchData();
   }, []);
  
   const roleSelectList =  Object.keys(Role).map((key,i) => ({
     key: i,
     value: i,
     text: Role[+key]
   })).filter(x=> x.text != '' && x.text != null);
   const lectureTypeSelectList =  Object.keys(LectureType).map((key,i) => ({
    key: i,
    value: i,
    text: LectureType[+key]
  })).filter(x=> x.text != '' && x.text != null);
   const fetchData = async () => {
     if(!id){
       return;
     }
  
     const roleSelectList =  Object.keys(Role).map((key,i) => ({
       key: i,
       value: +i,
       text: Role[+key]
     })).filter(x=> x.text != '' && x.text != null);
       const response = await UserService.GetUserDetails(id!);
       const userData = response;
       setValues({
        id: userData.id,
        userName: userData.userName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        responsibilities: userData.responsibilities,
        status: userData.status,
        academicGrade: userData.academicGrade,
        lectureType: userData.lectureType,
        scheduleTypeId: userData.scheduleTypeId,
        academicProgram: userData.academicProgram,
        groupId: userData.groupId,
      } as UserModel);
   };
   const navigate = useNavigate();
  const [state, setState] = useState(false);

  const fetchScheduleTypeList = async () => {
    const response = await ScheduleTypeService.GetSelectList();
  
    const formattedList = response
    .map((item: any, i: number) => ({
      key: i,
      value: item.id,
      text: item.name // this is already "Morning", "Afternoon", etc.
    } as SelectListItem))
    .filter(x => x.text !== '' && x.text !== null);

  setScheduleTypeList(formattedList);
  }
  useEffect(() => {
      fetchScheduleTypeList();
  }, []);

  const fetchGroupList = async () => {
    const response = await GroupService.GetSelectList();
  
    setGroupList(response.map((item,i)=>({
      key: i,
      value: item.id,
      text: item.name,
    } as SelectListItem)).filter(x=>x.text != '' &&x.text != null));
  
  
  }
  useEffect(() => {
    fetchGroupList();
  }, []);

  const cleanPayload = (values: UserModel) => {
    const payload = { ...values } as any;
  
    switch (values.role) {
      case Role.Admin:
        delete payload.lectureType;
        delete payload.scheduleTypeId;
        delete payload.groupId;
        delete payload.academicProgram;
        delete payload.academicGrade;
        delete payload.status;
        delete payload.responsibilities;
        break;
      case Role.Coordinator:
        delete payload.lectureType;
        delete payload.scheduleTypeId;
        delete payload.groupId;
        delete payload.academicProgram;
        delete payload.academicGrade;
        break;
      case Role.Receptionist:
        delete payload.lectureType;
        delete payload.scheduleTypeId;
        delete payload.groupId;
        delete payload.academicProgram;
        delete payload.academicGrade;
        break;
      case Role.Student:
        delete payload.lectureType;
        delete payload.scheduleTypeId;
        delete payload.responsibilities;
        delete payload.status;
        delete payload.academicGrade;
        break;
      case Role.Lecture:
        delete payload.groupId;
        delete payload.academicProgram;
        delete payload.responsibilities;
        break;
    }
  
    return payload;
  };
  // Funksioni për të dërguar formulën (krijuar/edituar përdoruesin)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const model = cleanPayload(values);

      const response = await axios.post(
        "https://localhost:7085/api/User", 
        model
      );
      setState(true);
      sendToOverview();
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Server response error:", error.response.data);
      } else {
        console.error("Error creating/updating user:", error);
      }
    }
  };

  const sendToOverview = () => {
    navigate('/UserTable'); 
  };

  // Funksioni për të përditësuar vlerat e fushave kur përdoruesi bën ndryshime
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Only parse lectureType and role as numbers
    const intFields = ["lectureType", "role"];
    setValues(prev => ({
      ...prev,
      [name]: intFields.includes(name) && value !== "" ? parseInt(value) : value
    }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      <h1 style={{ marginLeft: "15px", fontFamily: "Georgia", color: "black" }}>
        {values.id != null ? 'Edit' : 'Add'} User
      </h1>
      <p style={{ marginLeft: "15px", color: "#555", fontSize: "14px" }}>
        Please fill out the form below to {values.id != null ? 'edit' : 'create'} a User.
      </p>
      <Segment clearing style={{ margin: "30px 30px 0 10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", border: "1px solid rgb(15 179 126 / 87%)" }}>
        <form className="ui form" style={{ backgroundColor: "#f9f9f9", padding: "20px" }} onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>User Name</label>
            <input
              style={{ padding: "5px", margin: "5px" }}
              type="text"
              placeholder="User Name"
              className="form-control"
              id="userName"
              name="userName"
              value={values.userName!}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>LastName</label>
            <input
              style={{ padding: "5px", margin: "5px" }}
              type="text"
              placeholder="LastName"
              className="form-control"
              id="lastName"
              name="lastName"
              value={values.lastName!}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              style={{ padding: "5px", margin: "5px" }}
              type="email"
              placeholder="Email"
              className="form-control"
              id="email"
              name="email"
              value={values.email!}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password (Leave empty if you don't want to change)</label>
            <input
              style={{ padding: "5px", margin: "5px" }}
              type="password"
              placeholder="Password"
              className="form-control"
              id="password"
              name="password"
              value={values.password!}
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
           <label>Role</label>
           <select
            style={{ padding: "5px", margin: "5px" }}
            className="form-control"
            id="role"
            name="role"
            value={values.role!}
            onChange={handleChange}
           >
            {roleSelectList.map((x)=>
            (<option key={x.key} value={x.value}>{x.text}</option>))}
           </select>
          </div>
         {values.role === Role.Coordinator && (
          <>
          <div className="form-group">
            <label>Responsibilities</label>
            <input 
             style={{ padding: "5px", margin: "5px" }}
             type="text" 
             className="form-control"
             placeholder="Responsibilities"
             name="responsibilities"
             id="responsibilities" 
             value={values.responsibilities!} 
             onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <input 
             style={{ padding: "5px", margin: "5px" }}
             type="text" 
             className="form-control"
             placeholder="Status"
             name="status" 
             id="status"
             value={values.status!} 
             onChange={handleChange} 
            />
          </div>
          </>
          )}
          {values.role === Role.Receptionist && (
          <>
            <div className="form-group">
            <label>Responsibilities</label>
            <input 
             style={{ padding: "5px", margin: "5px" }}
             type="text" 
             className="form-control"
             placeholder="Responsibilities"
             name="responsibilities" 
             id="responsibilities"
             value={values.responsibilities!} 
             onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <input 
             style={{ padding: "5px", margin: "5px" }}
             type="text" 
             className="form-control"
             placeholder="Status"
             name="status" 
             id="status"
             value={values.status!} 
             onChange={handleChange} 
            />
          </div>
          </>
          )}

          {values.role === Role.Lecture && (
          <>
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
                style={{ marginBottom: "15px"}}
                value={values.lectureType!}
                onChange={handleChange}
              >
              {lectureTypeSelectList.map((x)=>
               (<option key={x.key} value={x.value}>{x.text}</option>))}
                  
              </select>
            </div>

            <div className="col-md-6-w-100%">
              <select className="form-control"
                name="scheduleTypeId" 
                id="scheduleTypeId"
                value= {values.scheduleTypeId!}
                onChange={handleChange}
                style={{ marginBottom: "15px"}}
              >
                <option value="" disabled>Select ScheduleTypeId</option>
                {scheduleTypeList.map((x) => (
                  <option key={x.key} value={x.value!}>{x.text}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
             <label>Status</label>
             <input 
              style={{ padding: "5px", margin: "5px" }}
              type="text" 
              className="form-control"
              placeholder="Status"
              name="status" 
              id="status"
              value={values.status!} 
              onChange={handleChange} 
             />
            </div>
          </>
          )}

          {values.role === Role.Student && (
          <>
            <div className="form-group">
             <label>Academic Program</label>
             <input 
              style={{ padding: "5px", margin: "5px" }}
              type="text" 
              className="form-control"
              placeholder="Academic Program"
              name="academicProgram" 
              id="academicProgram"
              value={values.academicProgram!} 
              onChange={handleChange} />
            </div>
            <div className="col-md-6-w-100%">
              <select className="form-control"
                name="groupId" 
                id="groupId"
                value= {values.groupId!}
                onChange={handleChange}
                style={{ marginBottom: "15px"}}
              >
                <option value="" disabled>Select GroupId</option>
                {groupList.map((x) => (
                  <option key={x.key} value={x.value!}>{x.text}</option>
                ))}
              </select>
            </div>
          </>
          )}

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
      <br />
      <br />
    </>
  );
}