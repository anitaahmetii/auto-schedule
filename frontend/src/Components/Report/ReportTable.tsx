import { Fragment, useEffect, useState } from "react";
import { ReportModel } from "../../Interfaces/ReportModel";
import { UserModel } from "../../Interfaces/UserModel";
import { Button, Modal, Table, Input } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { ReportService } from "../../Services/ReportService";
import { UserService } from "../../Services/UserService"; 

export default function ReportTable() {
    const navigate = useNavigate();

    const [reports, setReports] = useState<ReportModel[]>([]);
    const [users, setUsers] = useState<UserModel[]>([]); 
    const [searchUser, setSearchUser] = useState<string>(""); // ← shtuar për kërkimin e përdoruesve
    const [filteredReports, setFilteredReports] = useState<ReportModel[]>(reports); // ← shtuar për raportet e filtruar
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [deleteReportId, setDeletedReportId] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const reportsData = await ReportService.GetAllReports();
            const usersData = await UserService.GetSelectList(); 
            setReports(reportsData);
            setUsers(usersData);
            setFilteredReports(reportsData); // fillimisht filtrimi i të gjitha raporteve
        };
        fetchData();
    }, []);

    // Kërkimi i përdoruesit
    useEffect(() => {
        const filtered = reports.filter((report) => {
            const user = users.find((user) => user.id === report.userId);
            return user?.userName?.toLowerCase().includes(searchUser.toLowerCase()) || searchUser === "";
        });
        setFilteredReports(filtered);
    }, [searchUser, reports, users]);

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
        setFilteredReports(filteredReports.filter((report) => report.id !== id));
        setOpenConfirm(false);
        setDeletedReportId("");
    }
    const downloadPdf = async (report: ReportModel) => {
    try {
        const response = await fetch('https://localhost:7085/api/Report/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf',
            },
            body: JSON.stringify(report),
        });

        if (!response.ok) {
            throw new Error('Failed to download PDF');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Report-${report.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading PDF:', error);
    }
};
    return (
        <Fragment>
            <div className="d-flex align-items-center mt-4 mb-3 px-4">
                <h1 style={{ marginLeft: "30px" }}>Reports</h1>
                <Input
                    placeholder="Search by user..."
                    style={{ marginLeft: "20px", width: "250px" }}
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)} // Kërkimi për përdorues
                />
                <Button
                    type="button"
                    className="ui positive basic button ms-4"
                    onClick={() => addReport()}
                >
                    Add New Report
                </Button>
                <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
                </div>
            </div>

            <div className="px-4">
                <Table striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Comment</Table.HeaderCell>
                            <Table.HeaderCell>Absence</Table.HeaderCell>
                            <Table.HeaderCell>User</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredReports.map((report) => {
                            const user = users.find((u) => u.id === report.userId);
                            return (
                                <Table.Row key={report.id}>
                                    <Table.Cell>{report.comment}</Table.Cell>
                                    <Table.Cell>
                                        {report.absence }</Table.Cell>
                                    <Table.Cell>{user?.userName || "Unknown"}</Table.Cell>
                                    <Table.Cell>{new Date(report.dateTime).toLocaleString()}</Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            type="button"
                                            className="btn ui green basic button"
                                            onClick={() => editReport(report.id!)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            type="button"
                                            className="btn btn-danger"
                                            negative
                                            onClick={() => deleteReport(report.id!)}
                                        >
                                            Del
                                        </Button>
                                       <Button onClick={() => downloadPdf(report)}>Export as PDF</Button>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}

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
