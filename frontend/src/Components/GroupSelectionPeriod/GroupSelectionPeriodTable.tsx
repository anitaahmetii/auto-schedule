import { Fragment } from "react/jsx-runtime";
import { Button, Divider, Form, Header, Modal } from "semantic-ui-react";
import GroupSelectionPeriodDatas from "./GroupSelectionPeriodDatas";
import { GroupSelectionPeriodModel } from "../../Interfaces/GroupSelectionPeriodModel";
import { useEffect, useState } from "react";
import { GroupSelectionPeriodService } from "../../Services/GroupSelectionPeriodService";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { DepartmentService } from "../../Services/DepartmentService";


export default function GroupSelectionPeriodTable()
{
    const [isEditing, setIsEditing] = useState(false);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [deleteGroupId, setDeletedGroupId] = useState<string>("");
    const [groupSelections, setGroupSelections] = useState<GroupSelectionPeriodModel[]>([]);
    const [groupSelectionPeriods, setGroupSelectionPeriods] = useState<GroupSelectionPeriodModel>({
        id: null,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        departmentId: ""
    });
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name}));
    const [departments, setDepartments] = useState<SelectListItem[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const result = await GroupSelectionPeriodService.getAllGroupSelectionPeriodsAsync();
            setGroupSelections(result);
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const datas = await DepartmentService.GetSelectList();
            setDepartments(mapTo(datas));
        };
        fetchData();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
    {
        const { name, value } = e.target;
        setGroupSelectionPeriods({ ...groupSelectionPeriods, [name]: value });
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => 
    {
        e.preventDefault();
        try {
            if (!isEditing) 
            {
                await GroupSelectionPeriodService.createGroupSelectionPeriod(groupSelectionPeriods);
                setGroupSelections(prev => [...prev, groupSelectionPeriods]);
                console.log("Group period selection created successfully!");
            } 
            else if (isEditing)
            {
                const updated = await GroupSelectionPeriodService.updateGroupSelectionPeriod(groupSelectionPeriods);
                setGroupSelections(prev => prev.map(item => item.id === updated.id ? updated : item));
                console.log("Group period selection updated successfully!");
                setIsEditing(false);
            }
            setGroupSelectionPeriods({
                id: null,
                startDate: "",
                endDate: "",
                startTime: "",
                endTime: "",
                departmentId: ""
            });
        } catch (error) {
        console.error("Error creating the group period selection:", error);
        }
    }
    const handleEdit = async (period: GroupSelectionPeriodModel) => 
    {
        setIsEditing(true);
        setGroupSelectionPeriods(period);
    };
    const handleDelete = async (id: string | null) => 
    {
        setOpenConfirm(true);
        setDeletedGroupId(id!);
    }
    async function confirmToDelete(id: string)
    {
        await GroupSelectionPeriodService.deleteGroupSelectionPeriod(id);
        setGroupSelections(groupSelections.filter((group) => group.id !== id));
        setOpenConfirm(false);
        setDeletedGroupId("");
    }
    return (
        <Fragment>
            <div className="d-flex justify-content-center align-items-center mt-1 mb-4 px-3" >
                <Header as="h1">Create Group Selection Period</Header>
            </div>
            <div className="px-4 d-flex justify-content-center align-items-center">
                <div className="ui segment" style={{ padding: "1.5rem", maxWidth: "900px", width: "120%" }}>
                    <Form className="ui form" onSubmit={handleSubmit}>
                        <div className="fields" style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }} >
                            <div className="field" style={{ flex: 1 }}>
                                <label>Start Date</label>
                                <input type="date" style={{ width: "100%", height: "38px" }} 
                                    name="startDate" value={groupSelectionPeriods.startDate!} onChange={(e) => handleChange(e)}/>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>End Date</label>
                                <input type="date" style={{ width: "100%", height: "38px" }} 
                                    name="endDate" value={groupSelectionPeriods.endDate!} onChange={(e) => handleChange(e)}/>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>Start Time</label>
                                <input type="time" style={{ width: "100%", height: "38px" }} 
                                    name="startTime" value={groupSelectionPeriods.startTime!} onChange={(e) => handleChange(e)}/>
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                                <label>End Time</label>
                                <input type="time" style={{ width: "100%", height: "38px" }} 
                                    name="endTime" value={groupSelectionPeriods.endTime!} onChange={(e) => handleChange(e)}/>
                            </div>
                             <div className="field" style={{ flex: 1 }}>
                                <label>Department</label>
                                <select name="departmentId"className="ui dropdown" style={{ width: "100%", height: "38px" }} 
                                    value={groupSelectionPeriods.departmentId!} onChange={(e) => handleChange(e)}>
                                    <option value="" disabled>Select Department</option>
                                    {departments.map(d => (
                                        <option key={ d.key } value={d.value!}>{ d.text }</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center" style={{ marginTop: "5%", marginLeft: "1%" }} >
                            <Button color="grey" type="button" onClick={() =>setGroupSelectionPeriods({ id: null, startDate: "", endDate: "", startTime: "", endTime: "", departmentId: ""})}>
                                Cancel
                            </Button>
                            <Button style={{backgroundColor: '#34495e', color: 'white'}} type="submit">
                                {isEditing ? "Update" : "Create"}
                            </Button>
                        </div>
                    </Form>
                    <Divider style={{marginTop: '5%'}} />
                    <div>
                        <GroupSelectionPeriodDatas periods={groupSelections} onEdit={handleEdit} onDelete={handleDelete}/>
                    </div>
                    {openConfirm &&
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
                    }
                 </div>
            </div>
        </Fragment>
    );
}