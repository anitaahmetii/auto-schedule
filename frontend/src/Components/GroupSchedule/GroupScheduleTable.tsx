import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import ShowTable from "./ShowTable";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { GroupService } from "../../Services/GroupService";
import { ManualScheduleService } from "../../Services/ManualScheduleService";
import { Button } from "semantic-ui-react";

export default function GroupScheduleTable()
{
    const [studentId, setStudentId] = useState<string | null>(null);
    const [schedule, setSchedule] = useState<ManualScheduleModel>({
        id: null,
        day: "",
        startTime: "",
        endTime: "",
        courseLecturesId: "",
        hallsId: "",
        locationId: "",
        departmentId: "",
        groupId: ""
    });
    const [schedules, setSchedules] = useState<ManualScheduleModel[]>([]);
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name}))
    const [groups, setGroups] = useState<SelectListItem[]>([]);
    const [isSelected, setIsSelected] = useState(false);
    const [canChange, setCanChange] = useState(false);
    useEffect(() => {
        const storedStudentId = localStorage.getItem("studentId");
        if (storedStudentId) 
        {
            setStudentId(storedStudentId);
        }
    }, []);
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
    });
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => 
    {
        const { name, value } = e.target;
        setSchedule({...schedule, [name]: value});
        setIsSelected(true);
    };
    useEffect(() => {
        const fetchData = async () => {
            if (!schedule.groupId) return;
            const data = await ManualScheduleService.getGroupScheduleAsync(`${schedule.groupId}`);
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
    }, [schedule.groupId]);
    const handleSubmit = async () => 
    {
        await ManualScheduleService.selectGroupByStudent(studentId!, schedule.groupId);
        setIsSelected(false);
        setCanChange(true);
    }
    return (
        <Fragment>
            <div className=" d-flex justify-content-center align-items-center flex-column" style={{paddingTop: '2%'}}>
                <h1 style={{ marginBottom: '20px', fontWeight: 'bold', wordSpacing: '2px' }}>Group Selection</h1>
                <select className="olive" style={{ width: '200px', padding: '10px', fontSize: '16px', border: '2px solid olive', fontWeight: 'bold' }}
                name="groupId" value={schedule.groupId} onChange={(e) => handleChange(e)}
                disabled={canChange === true}
                >
                    <option value="" disabled>Select Your Group</option>
                    {groups.map(g => (
                        <option key={g.key} value={g.value!}>{g.text}</option>
                    ))}
                </select>
                {isSelected &&
                    <div style={{marginTop: '2%'}}>
                        <Button color="grey" type="submit" 
                        onClick={() => {setSchedule({id: null,
                                                    day: "",
                                                    startTime: "",
                                                    endTime: "",
                                                    courseLecturesId: "",
                                                    hallsId: "",
                                                    locationId: "",
                                                    departmentId: "",
                                                    groupId: ""}); 
                                        setIsSelected(false); 
                                        setSchedules([]);}}>Cancel</Button>
                        <Button color="olive" type="submit" onClick={handleSubmit}>
                            Select
                        </Button>
                    </div>
                }
                {canChange && 
                    <Button color="olive" style={{marginTop: '2%'}} onClick={() => {setCanChange(false); setIsSelected(true);}}>
                        Change
                    </Button>
                }
                <ShowTable schedule={schedules}/>
            </div>
        </Fragment>
    );
}