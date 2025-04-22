import { Fragment, useEffect, useState } from "react";
import { ReportModel } from "../../Interfaces/ReportModel";
import { Button, Modal, Table, Select } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { ReportService } from "../../Services/ReportService";

export default function ReportTable() {
    const navigate = useNavigate();

    const [reports, setReports] = useState<ReportModel[]>([]);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [deleteReportId, setDeletedReportId] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const result = await ReportService.GetAllReports();
            setReports(result);
        };
        fetchData();
    }, []);

    function addReport() {
        navigate("/AddReport");
    }

    function editReport(id: string | null) {
        navigate(`/EditReport/${id}`);
    }

    function deleteReport(id: string) {
        setOpenConfirm(true);
        setDeletedReportId(id);
    }

    async function confirmToDelete(id: string) {
        await ReportService.DeleteReport(id);
        setReports(reports.filter((report) => report.id !== id));
        setOpenConfirm(false);
        setDeletedReportId("");
    }

    return (
        <Fragment>
            <div className="d-flex align-items-center mt-4 mb-3 px-4">
                <h1 style={{ marginLeft: "30px" }}>Reports</h1>
                <Button
                    type="button"
                    style={{ color: "white" }}
                    color="olive"
                    className="ms-auto"
                    onClick={() => addReport()}
                >
                    Add New Report
                </Button>
            </div>

            <div className="px-4">
                <Table className="ui olive single line table">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Report</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {reports.map((report) => (
                            <Table.Row key={report.id}>
                                <Table.Cell>
                                    <Select
                                        options={[
                                            {
                                                key: report.id,
                                                text: report.comment,
                                                value: report.id,
                                            },
                                        ]}
                                        value={report.id}
                                        onChange={() => editReport(report.id)}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        color="olive"
                                        className="mr-2"
                                        onClick={() => editReport(report.id!)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color="red"
                                        className="mr-2"
                                        onClick={() => deleteReport(report.id!)}
                                    >
                                        Del
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                        <Modal
                            open={openConfirm}
                            size="mini"
                            onClose={() => setOpenConfirm(false)}
                            closeOnEscape={false}
                            closeOnDimmerClick={false}
                            style={{
                                minHeight: "unset",
                                height: "auto",
                                padding: "1rem",
                                textAlign: "center",
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 1000,
                            }}
                        >
                            <Modal.Content>
                                Are you sure you want to delete this report?
                            </Modal.Content>
                            <Modal.Actions
                                style={{
                                    justifyContent: "center",
                                    display: "flex",
                                    gap: "1rem",
                                }}
                            >
                                <Button onClick={() => setOpenConfirm(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    color="red"
                                    onClick={() => confirmToDelete(deleteReportId)}
                                >
                                    Delete
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Table.Body>
                </Table>
            </div>
        </Fragment>
    );
}