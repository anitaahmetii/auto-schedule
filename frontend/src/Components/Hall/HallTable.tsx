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
import { HallModel } from "../../Interfaces/HallModel";
import { HallService } from "../../Services/HallService";

export default function HallTable() {
  const [halls, setHalls] = useState<HallModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteHallId, setDeleteHallId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await HallService.GetAllHalls();
      setHalls(result);
    };
    fetchData();
  }, []);

  function deleteHall(id: string) {
    setOpenConfirm(true);
    setDeleteHallId(id);
  }

  async function confirmedDeleteHall(id: string) {
    await HallService.DeleteHall(id);
    setHalls(halls.filter((hall) => hall.id !== id));
    setOpenConfirm(false);
    setDeleteHallId("");
  }

  function sendToDetails(id: string | null) {
    navigate(`/EditHall/${id}`);
  }

  function AddHall() {
    navigate(`/AddHall`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>Hall</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={() => AddHall()}
        >
          Add New Hall
        </Button>
      </div>
      <Table striped>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Capacity</TableHeaderCell>
            <TableHeaderCell>Location</TableHeaderCell>
            <TableHeaderCell>UserName</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {halls.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.capacity}</TableCell>
              <TableCell>{item.locationId}</TableCell>
               <TableCell>{item.userName}</TableCell>
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
                  onClick={() => deleteHall(item.id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Confirm
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => confirmedDeleteHall(deleteHallId!)}
      />
    </Fragment>
  );
}
