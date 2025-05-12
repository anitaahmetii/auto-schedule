import React, { Fragment, useEffect, useState } from "react";
import {
  Table,
  Button,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Confirm,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { CourseLecturesModel } from "../../Interfaces/CourseLecturesModel";
import { CourseLecturesService } from "../../Services/CourseLecturesService";

export default function CourseLecturesTable() {
  const [courseLectures, setCourseLectures] = useState<CourseLecturesModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await CourseLecturesService.GetAllCourseLectures();
      setCourseLectures(result);
    };
    fetchData();
  }, []);

  function deleteCourseLecture(id: string) {
    setOpenConfirm(true);
    setDeleteId(id);
  }

  async function confirmedDelete(id: string) {
    await CourseLecturesService.DeleteCourseLectures(id);
    setCourseLectures(courseLectures.filter((x) => x.id !== id));
    setOpenConfirm(false);
    setDeleteId("");
  }

  function sendToDetails(id: string | null) {
    navigate(`/EditCourseLectures/${id}`);
  }

  function addCourseLecture() {
    navigate(`/AddCourseLecture`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>Course Lectures</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={() => addCourseLecture()}
        >
          Add New Course Lecture
        </Button>
      </div>
      <Table striped>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Lecture ID</TableHeaderCell>
            <TableHeaderCell>Course ID</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courseLectures.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.userId}</TableCell>
              <TableCell>{item.courseId}</TableCell>
              <TableCell>
                <Button
                  type="button"
                  className="btn ui green basic button"
                  onClick={() => sendToDetails(item.id!)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="btn btn-danger"
                  negative
                  onClick={() => deleteCourseLecture(item.id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <Confirm
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={() => confirmedDelete(deleteId!)}
          />
        </TableBody>
      </Table>
    </Fragment>
  );
}
