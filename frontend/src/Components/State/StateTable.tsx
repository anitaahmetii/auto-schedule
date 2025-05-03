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
import { StateModel } from "../../Interfaces/StateModel";
import { StateService } from "../../Services/StateService";
import { UserService } from "../../Services/UserService";

export default function CreditCardsTable() {
  const [states, setStates] = useState<StateModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteStateId, setDeleteStateId] = useState<string>("");
  
  const navigate = useNavigate();
  useEffect(()=>{
    const fetchData = async () => {
      const result = await StateService.GetAllStates();
      setStates(result);
    }
    fetchData();
  }, []);

  function deleteStates(id: string) {
    setOpenConfirm(true);
    setDeleteStateId(id);
  }

  async function confirmedDeleteState(id: string) {
    var result = await StateService.DeleteState(id);
    setStates(states.filter((state) => state.id !== id));
    setOpenConfirm(false);
    setDeleteStateId("");
  }

  function sendToDetails(id:string | null) {
    navigate(`/EditState/${id}`);
  }

  function AddState() {
    navigate(`/AddState`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>State</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={() => AddState()}
        >
          Add New State
        </Button>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
      </div>
      </div>
      <Table striped>
        <TableHeader>
          <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {states.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
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
                  onClick={() => deleteStates(item.id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <Confirm
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={() => confirmedDeleteState(deleteStateId!)}
          />
        </TableBody>
      </Table>
    </Fragment>
  );
}
