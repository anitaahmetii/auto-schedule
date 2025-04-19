import React, { Fragment, useEffect, useState } from "react";
import {
  Table,
  Button,
  Confirm,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { ReportModel } from "../Interfaces/ReportModel";
import { ReportService } from "../Services/ReportService";

export default function ReportsTable() {
  const [reports, setReports] = useState<ReportModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteReportId, setDeleteReportId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await ReportService.GetAllReports();
      setReports(result);
    };
    fetchData();
  }, []);

  function deleteReport(id: string) {
    setOpenConfirm(true);
    setDeleteReportId(id);
  }

  async function confirmedDeleteReport(id: string) {
    await ReportService.DeleteReport(id);
    setReports(reports.filter((report) => report.id !== id));
    setOpenConfirm(false);
    setDeleteReportId("");
  }

  function sendToDetails(id: string | null) {
    navigate(`/EditReport/${id}`);
  }

  function addReport() {
    navigate(`/AddReport`);
  }

  return (
    <Fragment>
      <div className="mt-5 d-flex align-items-center">
        <h1 style={{ marginLeft: "30px" }}>Reports</h1>
        <Button
          type="button"
          className="ui positive basic button ms-4"
          onClick={addReport}
        >
          Add New Report
        </Button>
      </div>

      <Table striped>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Absence</TableHeaderCell>
            <TableHeaderCell>Comment</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>User ID</TableHeaderCell>
            <TableHeaderCell>Schedule ID</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reports.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.absence}</TableCell>
              <TableCell>{item.comment}</TableCell>
              <TableCell>{new Date(item.dateTime).toLocaleString()}</TableCell>
              <TableCell>{item.userId}</TableCell>
              <TableCell>{item.scheduleId}</TableCell>
              <TableCell>
                <Button
                  type="button"
                  className="ui green basic button"
                  onClick={() => sendToDetails(item.id!)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="btn btn-danger"
                  negative
                  onClick={() => deleteReport(item.id!)}
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
        onConfirm={() => confirmedDeleteReport(deleteReportId!)}
      />
    </Fragment>
  );
}