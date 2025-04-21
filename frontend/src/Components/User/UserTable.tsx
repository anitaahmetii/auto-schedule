import React, { useEffect, useState, Fragment } from "react";
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
import { UserService } from "../../Services/UserService";
import { UserModel } from "../../Interfaces/UserModel";

export default function UsersTable() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await UserService.GetAllUsers();
      setUsers(result);
    };
    fetchData();
  }, []);

  function deleteUser(id: string) {
    setOpenConfirm(true);
    setDeleteUserId(id);
  }

  async function confirmedDelete(id: string) {
    await UserService.DeleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
    setOpenConfirm(false);
    setDeleteUserId("");
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>Users</h1>
        <Button
          className="ui positive basic button ms-4"
          onClick={() => navigate("/AddUser")}
        >
          Add New User
        </Button>
      </div>
      <Table striped>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Username</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Phone</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>
                <Button
                  className="ui green basic button"
                  onClick={() => navigate(`/EditUser/${user.id}`)}
                >
                  Edit
                </Button>
                <Button
                  negative
                  onClick={() => deleteUser(user.id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <Confirm
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={() => confirmedDelete(deleteUserId)}
          />
        </TableBody>
      </Table>
    </Fragment>
  );
}