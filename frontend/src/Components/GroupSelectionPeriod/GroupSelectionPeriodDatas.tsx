import { Fragment } from "react/jsx-runtime";
import { GroupSelectionPeriodModel } from "../../Interfaces/GroupSelectionPeriodModel";
import { Button, Table } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { DepartmentService } from "../../Services/DepartmentService";

type GroupSelectionPeriod = {
    periods: GroupSelectionPeriodModel[];
    onEdit: (period: GroupSelectionPeriodModel) => void;
    onDelete: (id: string | null) => void;
}
export default function GroupSelectionPeriodDatas({ periods, onEdit, onDelete }: GroupSelectionPeriod)
{
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name}));
    const [departments, setDepartments] = useState<SelectListItem[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const datas = await DepartmentService.GetSelectList();
            setDepartments(mapTo(datas));
        };
        fetchData();
    }, []);
    return (
        <Fragment>
                <Table className="ui striped single line table" >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Start Date</Table.HeaderCell>
                            <Table.HeaderCell>End Date</Table.HeaderCell>
                            <Table.HeaderCell>Start Time</Table.HeaderCell>
                            <Table.HeaderCell>End Time</Table.HeaderCell>
                            <Table.HeaderCell>Departments</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header> 
                        <Table.Body>
                            {periods.map(p => (
                                <Table.Row key={p.id}>
                                    <Table.Cell>{p.startDate}</Table.Cell>
                                    <Table.Cell>{p.endDate}</Table.Cell>
                                    <Table.Cell>{p.startTime}</Table.Cell>
                                    <Table.Cell>{p.endTime}</Table.Cell>
                                    <Table.Cell>{departments.find(d => d.value === p.departmentId)?.text}</Table.Cell>
                                    <Table.Cell>
                                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                                            <Button size="mini" style={{backgroundColor: '#34495e', color: 'white'}} className="mr-2" onClick={() => onEdit(p)}>
                                                Edit
                                            </Button>
                                            <Button size="mini" style={{marginTop:' 5%'}} color="red" className="mr-2" onClick={() => onDelete(p.id)}>
                                                Del
                                            </Button>
                                        </div>
                                        
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body> 
                </Table>
        </Fragment>
    );
}