import { useNavigate, useParams } from 'react-router-dom';

import React, { Fragment, useEffect, useState } from "react";
import { Button, Checkbox, CheckboxProps, Form, Header, Segment } from "semantic-ui-react";
import { CourseModel } from "../../Interfaces/CourseModel";
import { CourseService } from "../../Services/CourseService";

export default function EditCourse() {
const { id } = useParams<{ id: string}>();
const navigate = useNavigate();

const [course, setCourses] = useState<CourseModel>({
    id: null,
    name: "",
    ects: "",
    semester: "",
    isLecture: false,
    isExcercise: false,
    userId: ""
} as CourseModel);
useEffect(() => {
    const fetchData = async () => {
        if (id && typeof id === "string") 
        {
            const result = await CourseService.getByIdCourseAsync(id!);
            setCourses(result);
        }
    };
fetchData();
}, [id]); 
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
{
    const { name, value } = e.target;
    setCourses({ ...course, [name]: value });
}
const handleCheckBoxChange  = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) =>
{
    const name = data.name as keyof CourseModel;
    setCourses({ ...course, [name]: data.checked ?? false })
}
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => 
{
    e.preventDefault();
    try {
        await CourseService.updateCourseAsync(course);
        navigate(`/Course`);
        console.log("Course created successfully!");
    } catch (error) {
        console.error("Error creating course:", error);
    }
} 

return (
<Fragment>
    <div className="d-flex align-items-center mt-4 mb-3 px-4" >
    <Header as="h1">Update Course</Header>
    </div>
    <Segment clearing style={{  margin: "15px 30px 0 10px",
                                boxShadow: "0 6px 10px olive",  
                                borderRadius: "8px", 
                                transition: "box-shadow 0.3s ease-in-out",
                                }}>
        <div className="px-4" >
            <Form className="ui form" onSubmit={handleSubmit}>
                <Form.Field>
                    <label>Course Name</label>
                    <input  type="text" 
                            name="name"
                            value={course.name} 
                            placeholder="Course Name" 
                            style={{ border: "1px solid olive"}}
                            onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>ECTS</label>
                    <input type="text" 
                            name="ects"
                            value={course.ects} 
                            placeholder="ECTS" 
                            style={{ border: "1px solid olive"}} 
                            onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>Semester</label>
                    <input  type="text" 
                            name="semester"
                            value={course.semester} 
                            placeholder="Semester" 
                            style={{ border: "1px solid olive"}} 
                            onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>Course Type</label>
                    <div style={{ display: "flex", gap: "15px" }}>
                        <Checkbox   label="Lecture" 
                                    name="isLecture" 
                                    checked={course.isLecture}
                                    onChange={handleCheckBoxChange} />
                        <Checkbox   label="Excercise" 
                                    name="isExcercise" 
                                    checked={course.isExcercise}
                                    onChange={handleCheckBoxChange} />
                    </div>
                </Form.Field>
                <Form.Field>
                        <label>Administrator</label>
                        <input  type="text" 
                                name="userId" 
                                value={course.userId}
                                placeholder="Administrator" 
                                style={{ border: "1px solid olive"}}
                                onChange={handleChange} />
                </Form.Field>
                <Button color="grey" type="button" onClick={() => navigate(`/Course`)}>Cancel</Button>
                <Button color="olive" type="submit">Submit</Button>
            </Form>
        </div>
    </Segment>
</Fragment>
);
}
