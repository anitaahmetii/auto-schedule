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
import { DepartmentModel } from "../../Interfaces/DepartmentModel";
import { DepartmentService } from "../../Services/DepartmentService";

export default function DepartmentTable() {
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.trim() === "") {
        const result = await DepartmentService.GetAllDepartments();
        setDepartments(result);
      } else {
        const result = await DepartmentService.SearchDepartments(searchTerm);
        setDepartments(result);
      }
    };
  
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500); // kjo e shtyn kërkimin për 500ms pasi ndalet së shkruari
  
    return () => clearTimeout(delayDebounceFn); // pastron nëse shkruan shpejt
  }, [searchTerm]);

  const navigate = useNavigate();
  function deleteDepartment(id: string) {
    setOpenConfirm(true);
    setDeleteDepartmentId(id);
  }

  async function confirmedDeleteState(id: string) {
    var result = await DepartmentService.DeleteDepartment(id);
    setDepartments(departments.filter((department) => department.id !== id));
    setOpenConfirm(false);
    setDeleteDepartmentId("");
  }

  function sendToDetails(id:string | null) {
    navigate(`/EditDepartment/${id}`);
  }

  function AddDepartment() {
    navigate(`/AddDepartment`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>Department</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={() => AddDepartment()}
        >
          Add New Department
        </Button>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
      </div>
      </div>
      <div className="d-flex mb-3" style={{ marginLeft: "30px", marginTop: "20px" }}>
     <Input
         placeholder="Search by Name or Code"
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginRight: "10px" }}
      />
    </div>
      <Table striped>
        <TableHeader>
          <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Code</TableHeaderCell>
          {/* <TableHeaderCell>UserName</TableHeaderCell> */}
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {departments.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.code}</TableCell>
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
            onConfirm={() => confirmedDeleteState(deleteDepartmentId!)}
          />
        </TableBody>
      </Table>
    </Fragment>
  );
}