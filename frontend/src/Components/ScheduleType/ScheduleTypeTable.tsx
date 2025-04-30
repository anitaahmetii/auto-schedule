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
import { ScheduleTypeModel } from "../../Interfaces/ScheduleTypeModel";
import { ScheduleTypeService } from "../../Services/ScheduleTypeService";
import { UserService } from "../../Services/UserService"; // Shërbimi i përdoruesve

const ScheduleTypesMap: { [key: number]: string } = {
  1: "Morning",
  2: "Afternoon",
  3: "Hybrid",
};

const getScheduleTypeName = (scheduleTypeNumber: number | null) => {
  if (scheduleTypeNumber === null) return "Unknown";
  return ScheduleTypesMap[scheduleTypeNumber] || "Unknown";
};

export default function ScheduleTypesTable() {
  const [scheduleTypes, setScheduleTypes] = useState<ScheduleTypeModel[]>([]);
  const [users, setUsers] = useState<{ [key: string]: string }>({}); // Hapi: mbajmë një objekt për lidhjen userId -> userName
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteScheduleTypeId, setDeleteScheduleTypeId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await ScheduleTypeService.GetAllScheduleTypes();
      const usersData = await UserService.GetAllUsers(); // Merr përdoruesit

      // Krijo një hartë të ID-ve të përdoruesve me emrat e tyre
      const usersMap: { [key: string]: string } = {};
      usersData.forEach((user: any) => {
        usersMap[user.id] = user.userName; // Supozojmë që user ka `id` dhe `userName`
      });

      setScheduleTypes(result);
      setUsers(usersMap); // Ruaj hartën
    };

    fetchData();
  }, []);

  const getUserName = (userId: string) => {
    return users[userId] || "Unknown"; // Kërko emrin e përdoruesit nga harta
  };

  function deleteScheduleType(id: string) {
    setOpenConfirm(true);
    setDeleteScheduleTypeId(id);
  }

  async function confirmedDeleteScheduleType(id: string) {
    const result = await ScheduleTypeService.DeleteScheduleType(id);
    setScheduleTypes(scheduleTypes.filter((type) => type.id !== id));
    setOpenConfirm(false);
    setDeleteScheduleTypeId("");
  }

  function sendToDetails(id: string | null) {
    navigate(`/EditScheduleType/${id}`);
  }

  function addScheduleType() {
    navigate(`/AddScheduleType`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>Schedule Types</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={() => addScheduleType()}
        >
          Add New Schedule Type
        </Button>
      </div>

      <Table striped>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Schedule Type</TableHeaderCell>
            <TableHeaderCell>User</TableHeaderCell> {/* Kolona për emrin e përdoruesit */}
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {scheduleTypes.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{getScheduleTypeName(item.scheduleTypes)}</TableCell>
              <TableCell>{getUserName(item.userId)}</TableCell> {/* Emri i përdoruesit që ka krijuar këtë ScheduleType */}
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
                  onClick={() => deleteScheduleType(item.id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <Confirm
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={() => confirmedDeleteScheduleType(deleteScheduleTypeId!)}
          />
        </TableBody>
      </Table>
    </Fragment>
  );
}
