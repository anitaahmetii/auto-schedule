import { Fragment, useEffect, useState } from "react";
import { GroupModel } from "../../Interfaces/GroupModel";
import { Button, Modal, Table } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { GroupService } from "../../Services/GroupService";

export default function GroupTable()
{
    const navigate = useNavigate();

    const [groups, setGroups] = useState<GroupModel[]>([]);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [deleteGroupId, setDeletedGroupId] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const result = await GroupService.getAllGroupsAsync();
            setGroups(result);
        };
        fetchData();
    }, []);

    function addGroup()
    {
        navigate(`/AddGroup`);
    }
    function editGroup(id: string | null)
    {
        navigate(`/EditGroup/${id}`);
    }
    function deleteGroup(id: string)
    {
        setOpenConfirm(true);
        setDeletedGroupId(id);
    }
    async function confirmToDelete(id: string)
    {
        await GroupService.deleteGroupAsync(id);
        setGroups(groups.filter((group) => group.id !== id));
        setOpenConfirm(false);
        setDeletedGroupId("");
    }
    return (
        <Fragment>
        <div className="d-flex align-items-center mt-4 mb-3 px-4">
            <h1 style={{ marginLeft: "30px"}}>Groups</h1>
            <Button type="button" style={{color: "white"}} color="olive" 
                    className="ms-auto" 
                    onClick={() => addGroup()}> Add New Group </Button>
        </div>
        <div className="px-4">
            <Table className="ui olive single line table">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Capacity</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {groups.map((group) => (
                        <Table.Row key={group.id}>
                            <Table.Cell>{group.name}</Table.Cell>
                            <Table.Cell>{group.capacity}</Table.Cell>
                            <Table.Cell>
                                <Button color="olive" 
                                        className="mr-2"
                                        onClick={() => editGroup(group.id!)}>
                                    Edit
                                </Button>
                                <Button color="red" 
                                        className="mr-2"
                                        onClick={() => deleteGroup(group.id!)} >
                                    Del
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                     <Modal open={openConfirm}
                            size="mini"
                            onClose={() => setOpenConfirm(false)}
                            closeOnEscape={false}
                            closeOnDimmerClick={false}
                            style={{minHeight: 'unset',
                                    height: 'auto',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    position: 'fixed',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1000}}>
                        <Modal.Content>Are you sure you want to delete this group?</Modal.Content>
                        <Modal.Actions style={{ justifyContent: 'center', display: 'flex', gap: '1rem' }}>
                            <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
                            <Button color="red" onClick={() => confirmToDelete(deleteGroupId)}>Delete</Button>
                        </Modal.Actions>
                    </Modal>
                </Table.Body>
            </Table>
        </div>
    </Fragment>
    );
}