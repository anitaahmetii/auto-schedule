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
import { CoordinatorModel } from "../../Interfaces/CoordinatorModel";
import { CoordinatorService } from "../../Services/CoordinatorService";

export default function CoordinatorTable() {
  const [coordinators, setCoordinators] = useState<CoordinatorModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteCoordinatorId, setDeleteCoordinatorId] = useState<string>("");
  
  const navigate = useNavigate();
  useEffect(()=>{
    const fetchData = async () => {
      const result = await CoordinatorService.GetAllCoordinators();
      setCoordinators(result);
    };
    fetchData();
  }, []);

  function deleteDepartment(id: string) {
    setOpenConfirm(true);
    setDeleteCoordinatorId(id);
  }

  async function confirmedDeleteState(id: string) {
    var result = await CoordinatorService.DeleteCoordinator(id);
    setCoordinators(coordinators.filter((coordinator) => coordinator.id !== id));
    setOpenConfirm(false);
    setDeleteCoordinatorId("");
  }

  function sendToDetails(id:string | null) {
    navigate(`/EditCoordinator/${id}`);
  }

  function AddCoordinator() {
    navigate(`/AddCoordinator`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>Coordinator</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={() => AddCoordinator()}
        >
          Add New Department
        </Button>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
      </div>
      </div>
      <Table striped>
        <TableHeader>
          <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Responsibilities</TableHeaderCell>
          {/* <TableHeaderCell>UserName</TableHeaderCell> */}
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {coordinators.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.responsibilities}</TableCell>
              {/* <TableCell>{item.userName}</TableCell> */}
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
                  onClick={() => deleteDepartment(item.id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <Confirm
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={() => confirmedDeleteState(deleteCoordinatorId!)}
          />
        </TableBody>
      </Table>
    </Fragment>
  );
}