import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { CourseLecturesModel } from '../../Interfaces/CourseLecturesModel';
import { SelectListItem } from '../../Interfaces/SelectListItem';
import { CourseLecturesService } from '../../Services/CourseLecturesService';
import { CourseService } from '../../Services/CourseService';
import { UserService } from '../../Services/UserService';

export default function EditCourseLectures() {
  const { id } = useParams<{ id: string }>();
  const [userList, setUserList] = useState<SelectListItem[]>([]);
  const [courseList, setCourseList] = useState<SelectListItem[]>([]);
  const [lecturesList, setLecturesList] = useState<SelectListItem[]>([]);
  const [values, setValues] = useState<CourseLecturesModel>({
    id: id!,
    courseId: '',
    userId: '',
  } as CourseLecturesModel);

  const navigate = useNavigate();
  const [courseLectures, setcourseLectures] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id != null) {
        const response = await CourseLecturesService.GetCourseLecturesDetails(id);
        const userData = response;
        setValues({
          id: userData.id,
          courseId: userData.courseId,
          userId: userData.userId,
        } as CourseLecturesModel);
      }
    };

    fetchData();
  }, [id]);


   const fetchCourseList = async () => {
     const response = await CourseService.GetSelectList();
  
     if (Array.isArray(response)) {

        setCourseList(
        response.map((item, i) => ({
           key: i,
           value: item.id,
          text: item.name,
         }))
          .filter(x => x.text !== '' && x.text !== null));
     } else {
  
       console.error("Response is not an array:", response);
     }
   };
  
   
const fetchUserList = async () => {
  const response = await UserService.GetSelectList();

  const filteredList = response
    .filter((item) => item.role === 3) 
    .map((item, i) => ({
      key: i,
      value: item.id,
      text: item.userName,
    }) as SelectListItem);

  setUserList(filteredList);
};

  
  useEffect(() => {
    fetchCourseList();
    fetchUserList();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let model = {
        id: values.id!,
        courseId: values.courseId,
        userId: values.userId,
      } as unknown as CourseLecturesModel;

      const response = await axios.post(
        "https://localhost:7085/api/CourseLectures",
        model
      );
      setcourseLectures(true);
      sendToOverview();
    } catch (error) {
      console.error("Error creating CourseLecture:", error);
    }
  };

  function sendToOverview() {
    navigate('/CourseLecturesTable');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {values.id != null ? 'Edit' : 'Add'} CourseLecture
      </h1>
      <p style={{ marginLeft: "15px", color: "#555", fontSize: "14px" }}>
        Please fill out the form below to {values.id != null ? 'edit' : 'create'} a CourseLecture.
      </p>
      <Segment
        clearing
        style={{
          margin: "30px 30px 0 10px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid rgb(15 179 126 / 87%)"
        }}
      >
        <form className='ui form' style={{ backgroundColor: "#f9f9f9", padding: "20px" }} onSubmit={handleSubmit} autoComplete="off">
          <div className="form-control">
            <div className="col-md-6-w-100%">
              <label>Course</label>
              <select
                className="form-control"
                name="courseId"
                id="courseId"
                value={values.courseId || ""}
                onChange={handleSelectChange}
                style={{ marginBottom: "15px", padding: "5px", margin: "5px" }}
              >
                <option value="" disabled>Select Course</option>
                {courseList.map((x) => (
                  <option key={x.key} value={x.value!}>{x.text}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6-w-100%">
              <label>Lecture</label>
              <select
                className="form-control"
                name="userId"
                id="userId"
                value={values.userId || ""}
                onChange={handleSelectChange}
                style={{ marginBottom: "15px", padding: "5px", margin: "5px" }}
              >
                <option value="" disabled>Select Lecture</option>
                {userList.map((x) => (
                  <option key={x.key} value={x.value!}>{x.text}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
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
          </div>
        </form>
      </Segment>
      <br />
      <br />
    </>
  );
}