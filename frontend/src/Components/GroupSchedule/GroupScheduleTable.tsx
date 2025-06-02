import { Fragment, useEffect, useState } from "react";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { GroupService } from "../../Services/GroupService";
import ShowTable from "./ShowTable";
import { ManualScheduleService } from "../../Services/ManualScheduleService";
import { Button } from "semantic-ui-react";
import { GroupSelectionPeriodService } from "../../Services/GroupSelectionPeriodService";
import { GroupSelectionPeriodModel } from "../../Interfaces/GroupSelectionPeriodModel";

export default function GroupSchedule()
{
    const [studentId, setStudentId] = useState<string | null>(null);
    const [departmentId, setDepartmentId] = useState<string | null>(null);
    const [groupId, setGroupId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [groups, setGroups] = useState<SelectListItem[]>([]);
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name}))
    const [schedules, setSchedules] = useState<ManualScheduleModel[]>([]);
    const [canChange, setCanChange] = useState(false);
    const [toSelect, setToSelect] = useState(false);
    const [originalGroupId, setOriginalGroupId] = useState<string | null>(null);
    const [activePeriod, setActivePeriod] = useState<GroupSelectionPeriodModel | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const storedStudentId = localStorage.getItem("studentId");
        const storedDepartmentId = localStorage.getItem("departmentId");
        const storedRole = localStorage.getItem("userRole");

        if (storedStudentId && storedDepartmentId) 
        {
            setStudentId(storedStudentId);
            setDepartmentId(storedDepartmentId);
        };
        if (storedRole)
        {
            setUserRole(storedRole);
        }
    }, []);
    useEffect(() => {
        const fetchGroupsDepartment = async () => {
            if (!studentId || !departmentId || userRole !== "Student") return;
            const [groupR] = await Promise.all([GroupService.GetSelectListByDepartment(departmentId!)]);
            setGroups(mapTo(groupR));
        };
        fetchGroupsDepartment();
    }, [studentId, departmentId, userRole]);
    useEffect(() => {
        const fetchStudentGroup = async () => {
            if (!studentId || userRole !== "Student") return;
            const group = await GroupService.getGroupByStudentAsync(studentId!);
            if (group?.id && group.id.trim() !== "") 
            {     
                setGroupId(group.id);
                setOriginalGroupId(group.id);
                setCanChange(true);
            }
        };
        fetchStudentGroup();
    }, [studentId, userRole]);
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
    {
        const { name, value } = e.target;
        if (name === "groupId") 
        {
            setGroupId(value);
            setToSelect(true);
        }
    };
    useEffect(() => {
        const fetchGroupSchedule = async () => {
            if (!groupId || userRole !== "Student")  return;

            const data = await ManualScheduleService.getGroupScheduleAsync(groupId!);
            const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const sortedData = data.sort((a, b) => {
                const dayComparison = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
                if (dayComparison !== 0) return dayComparison;

                if (a.startTime < b.startTime) return -1;
                if (a.startTime > b.startTime) return 1;
                return 0;
            });
            setSchedules(sortedData);
        };
        if (groupId && userRole === "Student")
        {
            fetchGroupSchedule();
        }
    }, [groupId, userRole]);
    const handleSubmit = async () => 
    {
        try 
        {
            await ManualScheduleService.selectGroupByStudent(studentId!, groupId!);
            setToSelect(false);
            setCanChange(true);
            setError(false);
        } 
        catch (error: any) 
        {
            setError(true);
            console.log(error.message || "An error occurred while selecting group.");
        }
    };
    const handleCancel = () => 
    {
        if (originalGroupId) 
        {
            setGroupId(originalGroupId);
            setCanChange(true);
        } 
        else 
        {
            setGroupId("");
            setSchedules([]); 
        }
        setToSelect(false);
    };
    useEffect(() => {
        if (!departmentId || userRole !== "Student") return;
        const fetchActivePeriod = async () => {
            const data = await GroupSelectionPeriodService.isGroupSelectionPeriodActiveAsync(departmentId!);
            setActivePeriod(data);
        };
        fetchActivePeriod();
    }, [departmentId, userRole])
    return (
        <Fragment>
            <div className=" d-flex justify-content-center align-items-center flex-column" style={{paddingTop: '2%'}}>
                <h1 style={{ marginBottom: '20px', fontWeight: 'bold', wordSpacing: '2px' }}>Group Selection</h1>
                {activePeriod && 
                    <p style={{width: '80%', textAlign: 'center', fontFamily: 'sans-serif'}}>
                        Group selection is available from <strong>{activePeriod.startDate}</strong> at <strong style={{color: 'red'}}>{activePeriod.startTime} </strong> 
                        to <strong>{activePeriod.endDate}</strong> at <strong style={{color: 'red'}}>{activePeriod.endTime}</strong>.
                    </p>
                }
                {error && 
                    <p style={{width: '80%', textAlign: 'center', fontFamily: 'sans-serif', color: 'red', fontStyle: 'italic'}}>
                        No available spots in the selected group. Please try another group or contact administration.
                    </p>
                }
                <select className="olive" style={{ width: '200px', padding: '10px', fontSize: '16px', border: '2px solid olive', fontWeight: 'bold',  cursor: activePeriod ? 'pointer' : 'not-allowed',
                                                    pointerEvents: activePeriod ? 'auto' : 'none' }}
                name="groupId" value={groupId || ""} onChange={(e) => handleChange(e)} disabled={canChange === true && activePeriod !== null}>
                    <option value="" disabled>Select Your Group</option>
                    {groups.map(g => (
                        <option key={g.key} value={g.value!}>{g.text}</option>
                    ))}
                </select>
                {activePeriod && (
                    <>
                        {toSelect && (
                            <div style={{marginTop: '2%'}}>
                                <Button color="grey" type="submit" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button color="olive" type="submit" onClick={handleSubmit}>
                                    Select
                                </Button>
                            </div>
                        )}
                        {canChange && (
                            <Button color="olive" style={{marginTop: '2%'}} onClick={() => {setCanChange(false); setToSelect(true)}}>
                                Change
                            </Button>
                        )}
                    </>
                )}
                <ShowTable schedule={ schedules }/>
            </div>
        </Fragment>
    );
}