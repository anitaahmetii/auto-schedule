import { Fragment, useState } from "react";
import { GroupModel } from "../../Interfaces/GroupModel";
import { Button, Table } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

export default function GroupTable()
{
    const navigate = useNavigate();

    const [groups, setGroups] = useState<GroupModel[]>([]);

    function addGroup()
    {
        navigate(`/AddGroup`);
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
                    {groups.map((groups) => (
                        <Table.Row key={groups.id}>
                            <Table.Cell>{groups.name}</Table.Cell>
                            <Table.Cell>{groups.capacity}</Table.Cell>
                            <Table.Cell>
                                <Button color="olive" 
                                        className="mr-2"
                                        >
                                    Edit
                                </Button>
                                <Button color="red" 
                                        className="mr-2"
                                        >
                                    Del
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    </Fragment>
    );
}