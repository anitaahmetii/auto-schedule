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
                                        {report.absence ? (
                                            <span style={{ color: "red" }}>Absent</span>
                                        ) : (
                                            <span style={{ color: "green" }}>Present</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>{user?.userName || "Unknown"}</Table.Cell>
                                    <Table.Cell>{new Date(report.dateTime).toLocaleString()}</Table.Cell>
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
