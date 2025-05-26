import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import ShowTable from "./ShowTable";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { SelectListItem } from "../../Interfaces/SelectListItem";
import { GroupService } from "../../Services/GroupService";
import { ManualScheduleService } from "../../Services/ManualScheduleService";

export default function GroupScheduleTable()
{
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
    const[schedules, setSchedules] = useState<ManualScheduleModel[]>([]);
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({ key: i, value: item.id, text: item.name}))
    const[groups, setGroups] = useState<SelectListItem[]>([]);

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
    };
    useEffect(() => {
        const fetchData = async () => {
            if (!schedule.groupId) return;
            const data = await ManualScheduleService.getGroupScheduleAsync(`${schedule.groupId}`);
            setSchedules(data);
        }
        fetchData();
    }, [schedule.groupId]);
    
    return (
        <Fragment>
            <div className=" d-flex justify-content-center align-items-center flex-column" style={{paddingTop: '2%'}}>
                <h1 style={{ marginBottom: '20px', fontWeight: 'bold', wordSpacing: '2px' }}>Group Selection</h1>
                <select className="olive" style={{ width: '200px', padding: '10px', fontSize: '16px', border: '2px solid olive', fontWeight: 'bold' }}
                    name="groupId" value={schedule.groupId} onChange={(e) => handleChange(e)}>
                    <option value="" disabled>Select Your Group</option>
                    {groups.map(g => (
                        <option key={g.key} value={g.value!}>{g.text}</option>
                    ))};
                </select>
                <ShowTable schedule={schedules}/>
            </div>
        </Fragment>
    );
}