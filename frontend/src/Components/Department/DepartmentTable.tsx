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
import { Dropdown } from "semantic-ui-react";

export default function DepartmentTable() {
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string | "">("");
const [selectedCode, setSelectedCode] = useState<string | "">("");
const nameOptions = [
  { key: "all", value: "", text: "All Names" },
  ...Array.from(new Set(
    departments
      .map(d => d.name)
      .filter((name): name is string => typeof name === "string" && name.trim() !== "")
  )).map(name => ({
    key: name,
    value: name,
    text: name
  }))
];
const codeOptions = [
  { key: "all", value: "", text: "All Names" },
  ...Array.from(new Set(
    departments
      .map(d => d.code)
      .filter((code): code is string => typeof code === "string" && code.trim() !== "")
  )).map(code => ({
    key: code,
    value: code,
    text: code
  }))
];

 useEffect(() => {
  const fetchData = async () => {
    let result = await DepartmentService.GetAllDepartments();

    // filtro me searchTerm (emër ose kod)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
            (d.name?.toLowerCase() ?? "").includes(term) || (d.code?.toLowerCase() ?? "").includes(term)
      );
    }

    // filtro sipas selectedName nëse është zgjedhur
    if (selectedName) {
      result = result.filter((d) => d.name === selectedName);
    }

    // filtro sipas selectedCode nëse është zgjedhur
    if (selectedCode) {
      result = result.filter((d) => d.code === selectedCode);
    }

    // bëj sortimin
    if (sortBy) {
      if (sortBy === "name_asc")
  result.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
else if (sortBy === "name_desc")
  result.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
else if (sortBy === "code_asc")
  result.sort((a, b) => (a.code ?? "").localeCompare(b.code ?? ""));
else if (sortBy === "code_desc")
  result.sort((a, b) => (b.code ?? "").localeCompare(a.code ?? ""));
    }

    setDepartments(result);
  };

  const delayDebounceFn = setTimeout(() => {
    fetchData();
  }, 500);

  return () => clearTimeout(delayDebounceFn);
}, [searchTerm, sortBy, selectedName, selectedCode]);


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
  const sortOptions = [
  { key: 'name_asc', value: 'name_asc', text: 'Name A-Z' },
  { key: 'name_desc', value: 'name_desc', text: 'Name Z-A' },
  { key: 'code_asc', value: 'code_asc', text: 'Code A-Z' },
  { key: 'code_desc', value: 'code_desc', text: 'Code Z-A' },
];
const searchFieldOptions = [
  { key: "all", value: "all", text: "Name or Code" },
  { key: "name", value: "name", text: "Name" },
  { key: "code", value: "code", text: "Code" },
];

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
        <Dropdown
    placeholder="Sort By"
    selection
    options={sortOptions}
    onChange={(e, { value }) => setSortBy(value as string)}
    value={sortBy}
  />
   <Dropdown
    placeholder="Filter by Name"
    selection
    options={nameOptions}
    value={selectedName}
    onChange={(e, { value }) => setSelectedName(value as string)}
    style={{ marginRight: "10px" }}
  />

  <Dropdown
    placeholder="Filter by Code"
    selection
    options={codeOptions}
    value={selectedCode}
    onChange={(e, { value }) => setSelectedCode(value as string)}
    style={{ marginRight: "10px" }}
  />
    </div>
      <Table striped>
        <TableHeader>
          <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Code</TableHeaderCell>
          <TableHeaderCell>UserName</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {departments.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.code}</TableCell>
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