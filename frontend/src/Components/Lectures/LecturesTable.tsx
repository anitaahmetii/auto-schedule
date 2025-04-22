import React, { Fragment, useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Confirm,
} from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { LecturesModel } from "../../Interfaces/LecturesModel";
import { LecturesService } from "../../Services/LecturesService";

export default function LecturesTable() {
  const [lectures, setLectures] = useState<LecturesModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteLecturesId, setDeleteLecturesId] = useState<string>("");
  
  const navigate = useNavigate();
  useEffect(()=>{
    const fetchData = async () => {
      const result = await LecturesService.GetAllLectures();
      setLectures(result);
    };
    fetchData();
  }, []);

  function deleteLectures(id: string) {
    setOpenConfirm(true);
    setDeleteLecturesId(id);
  }

  async function confirmedDeleteLectures(id: string) {
    var result = await LecturesService.DeleteLectures(id);
    setLectures(lectures.filter((lecture) => lecture.id !== id));
    setOpenConfirm(false);
    setDeleteLecturesId("");
  }

  function sendToDetails(id:string | null) {
    navigate(`/EditLectures/${id}`);
  }

  function AddLectures() {
    navigate(`/AddLectures`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>Lecturer</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={() => AddLectures()}
        >
          Add New Lecturer
        </Button>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
      </div>
      </div>
      <Table striped>
        <TableHeader>
          <TableRow>
          <TableHeaderCell>Academic Grade</TableHeaderCell>
          <TableHeaderCell>Lecturer Rank</TableHeaderCell>
          <TableHeaderCell>ScheduleTypeId</TableHeaderCell>
          <TableHeaderCell>UserId</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {lectures.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.academicGrade}</TableCell>
              <TableCell>{item.lectureType}</TableCell>
              <TableCell>{item.scheduleTypeId}</TableCell>
              <TableCell>{item.userId}</TableCell>
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
                  onClick={() => deleteLectures(item.id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <Confirm
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={() => confirmedDeleteLectures(deleteLecturesId!)}
          />
        </TableBody>
      </Table>
    </Fragment>
  );
}
