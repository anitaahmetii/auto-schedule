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
import { ScheduleTypeModel } from "../../Interfaces/ScheduleTypeModel"; // Importi i duhur për ScheduleTypeModel
import { ScheduleTypeService } from "../../Services/ScheduleTypeService"; // Shërbimi për ScheduleTypes

export default function ScheduleTypesTable() {
  const [scheduleTypes, setScheduleTypes] = useState<ScheduleTypeModel[]>([]); // Ndryshimi nga ScheduleTypes[] në ScheduleTypeModel[]
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteScheduleTypeId, setDeleteScheduleTypeId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await ScheduleTypeService.GetAllScheduleTypes(); // Sigurohu që shërbimi kthen një listë me ScheduleTypeModel[]
      setScheduleTypes(result);
    };
    fetchData();
  }, []);

  function deleteScheduleType(id: string) {
    setOpenConfirm(true);
    setDeleteScheduleTypeId(id);
  }

  async function confirmedDeleteScheduleType(id: string) {
    const result = await ScheduleTypeService.DeleteScheduleType(id); // Sigurohu që kjo funksionon siç duhet
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
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {scheduleTypes.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.scheduleTypes}</TableCell> {/* Sigurohu që scheduleTypes është i definuar si duhet */}
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