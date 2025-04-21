import { useNavigate, useParams } from 'react-router-dom';

import React, { Fragment, useEffect, useState } from "react";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import { GroupService } from '../../Services/GroupService';
import { GroupModel } from '../../Interfaces/GroupModel';

export default function EditGroup() {
const { id } = useParams<{ id: string}>();
const navigate = useNavigate();

const [group, setGroup] = useState<GroupModel>({
    id: null,
    name: "",
    capacity: 0,
    userId: ""
} as GroupModel);
useEffect(() => {
    const fetchData = async () => {
        if (id && typeof id === "string") 
        {
            const result = await GroupService.getByIdGroupAsync(id!);
            setGroup(result);
        }
    };
fetchData();
}, [id]); 
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
{
    const { name, value } = e.target;
    setGroup({ ...group, [name]: value });
}
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => 
{
    e.preventDefault();
    try {
        await GroupService.updateGroupAsync(group);
        navigate(`/Group`);
        console.log("Group created successfully!");
    } catch (error) {
        console.error("Error creating group:", error);
    }
} 
return (
<Fragment>
    <div className="d-flex align-items-center mt-4 mb-3 px-4" >
    <Header as="h1">Update Group</Header>
    </div>
    <Segment clearing style={{  margin: "15px 30px 0 10px",
                                boxShadow: "0 6px 10px olive",  
                                borderRadius: "8px", 
                                transition: "box-shadow 0.3s ease-in-out",
                                }}>
        <div className="px-4" >
            <Form className="ui form" onSubmit={handleSubmit}>
                <Form.Field>
                    <label>Group Name</label>
                    <input  type="text" 
                            name="name"
                            value={group.name} 
                            placeholder="Group Name" 
                            style={{ border: "1px solid olive"}}
                            onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>Capacity</label>
                    <input type="text" 
                            name="capacity"
                            value={group.capacity} 
                            placeholder="ECTS" 
                            style={{ border: "1px solid olive"}} 
                            onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>Administrator</label>
                    <input  type="text" 
                            name="userId" 
                            value={group.userId}
                            placeholder="Administrator" 
                            style={{ border: "1px solid olive"}}
                            onChange={handleChange} />
                </Form.Field>
                <Button color="grey" type="button" onClick={() => navigate(`/Group`)}>Cancel</Button>
                <Button color="olive" type="submit">Submit</Button>
            </Form>
        </div>
    </Segment>
</Fragment>
);
}