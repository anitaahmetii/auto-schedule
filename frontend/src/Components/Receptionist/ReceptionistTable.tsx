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
import { ReceptionistModel } from "../../Interfaces/ReceptionistModel";
import { ReceptionistService } from "../../Services/ReceptionistService";

export default function ReceptionistTable() {
  const [receptionists, setReceptionists] = useState<ReceptionistModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteReceptionistId, setDeleteReceptionistId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await ReceptionistService.GetAllReceptionists();
      setReceptionists(result);
    };
    fetchData();
  }, []);

  function deleteReceptionist(id: string) {
    setOpenConfirm(true);
    setDeleteReceptionistId(id);
  }

  async function confirmedDeleteReceptionist(id: string) {
    await ReceptionistService.DeleteReceptionist(id);
    setReceptionists(receptionists.filter((r) => r.id !== id));
    setOpenConfirm(false);
    setDeleteReceptionistId("");
  }

  function sendToDetails(id: string | null) {
    navigate(`/EditReceptionist/${id}`);
  }

  function addReceptionist() {
    navigate(`/AddReceptionist`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>Receptionists</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={addReceptionist}
        >
          Add New Receptionist
        </Button>
      </div>
      <Table striped>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Responsibilities</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {receptionists.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.responsibilities}</TableCell>
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
                  onClick={() => deleteReceptionist(item.id!)}
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
        onConfirm={() => confirmedDeleteReceptionist(deleteReceptionistId)}
      />
    </Fragment>
  );
}
