import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import ShowTable from "./ShowTable";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { GroupService } from "../../Services/GroupService";
import { ManualScheduleService } from "../../Services/ManualScheduleService";
import { Button } from "semantic-ui-react";
import { GroupSelectionPeriodService } from "../../Services/GroupSelectionPeriodService";
import { GroupSelectionPeriodModel } from "../../Interfaces/GroupSelectionPeriodModel";

export default function GroupScheduleTable()
{
    const [studentId, setStudentId] = useState<string | null>(null);
    const [departmentId, setDepartmentId] = useState<string | null>(null);
    const [groupId, setGroupId] = useState<string | null>(null);
    const [schedule, setSchedule] = useState<ManualScheduleModel>({
        id: null,
        day: "",
        startTime: "",
        endTime: "",
        courseLecturesId: "",
        hallsId: "",
        locationId: "",
        departmentId: "",
        groupId: groupId ?? "",
    });
    const [schedules, setSchedules] = useState<ManualScheduleModel[]>([]);
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name}))
    const [groups, setGroups] = useState<SelectListItem[]>([]);
    const [isSelected, setIsSelected] = useState(false);
    const [canChange, setCanChange] = useState(false);
    const [activePeriod, setActivePeriod] = useState<GroupSelectionPeriodModel | null>(null);
    const [originalGroupId, setOriginalGroupId] = useState<string | null>(null);

    useEffect(() => {
        const storedStudentId = localStorage.getItem("studentId");
        const storedDepartmentId = localStorage.getItem("departmentId");
        if (storedStudentId && storedDepartmentId) 
        {
            setStudentId(storedStudentId);
            setDepartmentId(storedDepartmentId);
        } 
    }, []);
   useEffect(() => {
    const fetchStudentGroup = async () => {
        if (!studentId) return;
        try {
        const group = await GroupService.getGroupByStudentAsync(studentId);
        if (group && group.id) 
        {
            localStorage.setItem("groupId", group.id);
            setGroupId(group.id);
            setOriginalGroupId(group.id);
            setCanChange(true);
        }
        } catch (error) 
        {
            console.error("Could not fetch student's group", error);
            localStorage.removeItem("groupId");
            setOriginalGroupId(null);
            setGroupId(null);
        }
    };
    fetchStudentGroup();
    }, [studentId]);
    useEffect(() => {
        let isFetched = false;
        const fetchData = async () => {
            try
            {
                const [groupR] = await Promise.all([GroupService.GetSelectList()]);
                if (!isFetched)
                {
                    setGroups(mapTo(groupR));
                }
            }
            catch (err) 
            {
                console.error("Lists could not be uploaded!", err);
            }
        };
        fetchData();
        return () => {
            isFetched = true;
        } ;
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
    {
        const { name, value } = e.target;
        setSchedule({...schedule, [name]: value});
        if (name === "groupId") {
            setGroupId(value); 
        }
        setIsSelected(true);
    };
    useEffect(() => {
        const fetchData = async () => {
            if (!groupId) return;
            
            const data = await ManualScheduleService.getGroupScheduleAsync(groupId);
            const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const sortedData = data.sort((a, b) => {
                const dayComparison = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
                if (dayComparison !== 0) return dayComparison;

                if (a.startTime < b.startTime) return -1;
                if (a.startTime > b.startTime) return 1;
                return 0;
            });
            setSchedules(sortedData);
        }
        fetchData();
    }, [groupId]);
    const handleSubmit = async () => 
    {
        await ManualScheduleService.selectGroupByStudent(studentId!, schedule.groupId);
        setIsSelected(false);
        setCanChange(true);
    }
    useEffect(() => {
        if (!departmentId) return;
        const fetchData = async () => {
            try 
            {
                const data = await GroupSelectionPeriodService.isGroupSelectionPeriodActiveAsync(departmentId!);
                setActivePeriod(data);
            } 
            catch (err) 
            {
                console.error("No active period found or error occurred:", err);
                setActivePeriod(null); 
            }
        };
        fetchData();
    }, [isSelected, departmentId]);
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
                <select className="olive" style={{ width: '200px', padding: '10px', fontSize: '16px', border: '2px solid olive', fontWeight: 'bold' }}
                name="groupId" value={schedule.groupId || groupId!} onChange={(e) => handleChange(e)}
                disabled={canChange}
                >
                    <option value="" disabled>Select Your Group</option>
                    {groups.map(g => (
                        <option key={g.key} value={g.value!}>{g.text}</option>
                    ))}
                </select>
                {activePeriod && (
                    <>
                        {isSelected && (
                            <div style={{marginTop: '2%'}}>
                                <Button color="grey" type="submit" 
                                onClick={() => {if (!originalGroupId) { setGroupId(null);
                                                setSchedule({ id: null,
                                                day: "",
                                                startTime: "",
                                                endTime: "",
                                                courseLecturesId: "",
                                                hallsId: "",
                                                locationId: "",
                                                departmentId: "",
                                                groupId: "",
                                                }); setSchedules([]); setCanChange(true);
                                            } else {
                                                setGroupId(originalGroupId);
                                                setSchedule((prev) => ({
                                                    ...prev,
                                                    groupId: originalGroupId!,
                                                }));
                                            }
                                            setCanChange(true); setIsSelected(false); }}>Cancel</Button>
                                <Button color="olive" type="submit" onClick={handleSubmit}>
                                    Select
                                </Button>
                            </div>
                        )}
                        {canChange && groupId &&(
                            <Button color="olive" style={{marginTop: '2%'}} onClick={() => {setCanChange(false); setIsSelected(true);}}>
                                Change
                            </Button>
                        )}
                    </>
                )}
                <ShowTable schedule={ schedules } />
            </div>
        </Fragment>
    );
}