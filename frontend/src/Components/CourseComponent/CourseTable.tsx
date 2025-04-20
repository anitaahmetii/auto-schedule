import { CourseModel } from "../../Interfaces/CourseModel";
import { CourseService } from "../../Services/CourseService";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, } from "semantic-ui-react";

export default function CoursesTable()
{
    const [courses, setCourses] = useState<CourseModel[]>([]);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [deleteCourseId, setDeletedCourseId] = useState<string>("");

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            const result = await CourseService.getAllCoursesAsync();
            setCourses(result);
        };
        fetchData();
    }, []);
    
    function addCourse()
    {
        navigate(`/AddCourse`);
    }
    function editCourse(id: string | null)
    {
        navigate(`/EditCourse/${id}`);
    }
    function deleteCourse(id: string)
    {
        setOpenConfirm(true);
        setDeletedCourseId(id);
    }
    async function confirmToDelete(id: string)
    {
        await CourseService.deleteCourseAsync(id);
        setCourses(courses.filter((course) => course.id !== id));
        setOpenConfirm(false);
        setDeletedCourseId("");
    }
    return (
        <Fragment>
        <div className="d-flex align-items-center mt-4 mb-3 px-4">
            <h1 style={{ marginLeft: "30px"}}>Courses</h1>
            <Button type="button" style={{color: "white"}} color="olive" 
                    className="ms-auto" 
                    onClick={() => addCourse()}> Add New Course </Button>
        </div>
        <div className="px-4">
            <Table className="ui olive single line table">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>ECTS</Table.HeaderCell>
                        <Table.HeaderCell>Semester</Table.HeaderCell>
                        <Table.HeaderCell>Lecture</Table.HeaderCell>
                        <Table.HeaderCell>Exercise</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {courses.map((course) => (
                        <Table.Row key={course.id}>
                            <Table.Cell>{course.name}</Table.Cell>
                            <Table.Cell>{course.ects}</Table.Cell>
                            <Table.Cell>{course.semester}</Table.Cell>
                            <Table.Cell>{course.isLecture ? "Yes" : "No"}</Table.Cell>
                            <Table.Cell>{course.isExcercise ? "Yes" : "No"}</Table.Cell>
                            <Table.Cell>
                                <Button color="olive" 
                                        className="mr-2"
                                        onClick={() => editCourse(course.id!)}
                                        >
                                    Edit
                                </Button>
                                <Button color="red" 
                                        className="mr-2"
                                        onClick={() => deleteCourse(course.id!)}>
                                    Del
                                </Button>
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
                        <Modal.Content>Are you sure you want to delete this course?</Modal.Content>
                        <Modal.Actions style={{ justifyContent: 'center', display: 'flex', gap: '1rem' }}>
                            <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
                            <Button color="red" onClick={() => confirmToDelete(deleteCourseId)}>Delete</Button>
                        </Modal.Actions>
                    </Modal>
                </Table.Body>
            </Table>
        </div>
    </Fragment>
    );
}