import { Fragment, useEffect, useState } from "react";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";
import { GroupService } from "../../Services/GroupService";
import { ManualScheduleService } from "../../Services/ManualScheduleService";
import ShowTable from "./ShowTable";


export default function MyStudentSchedule()
{
    const [studentId, setStudentId] = useState<string | null>(null);
    const [groupId, setGroupId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [schedule, setSchedule] = useState<ManualScheduleModel[]>([]);
    useEffect(() => {
        const storedStudentId = localStorage.getItem("studentId");
        const storedRole = localStorage.getItem("userRole");

        if (storedStudentId && storedRole) 
        {
            setStudentId(storedStudentId);
            setUserRole(storedRole);
        };
    }, []);
    useEffect(() => {
        if (!studentId || userRole !== "Student") return;
        const fetchStudentGroup = async () => {
            const data = await GroupService.getGroupByStudentAsync(studentId!);
            setGroupId(data.id);
        };
        fetchStudentGroup();
    }, [studentId, userRole]);
    useEffect(() => {
        if (!studentId || userRole !== "Student" || !groupId) return;
        const fetchStudentSchedule = async () => {
            const data = await ManualScheduleService.getGroupScheduleAsync(groupId!);
            const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const sortedData = data.sort((a, b) => {
                const dayComparison = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
                if (dayComparison !== 0) return dayComparison;

                if (a.startTime < b.startTime) return -1;
                if (a.startTime > b.startTime) return 1;
                return 0;
            });
            setSchedule(sortedData);
        };
        fetchStudentSchedule();
    }, [studentId, userRole, groupId]);
    return (
        <Fragment>
            <div className=" d-flex justify-content-center align-items-center flex-column" style={{paddingTop: '2%'}}>
                <h1 style={{ marginBottom: '20px', fontWeight: 'bold', wordSpacing: '2px' }}>My Schedule</h1>
                <ShowTable schedule={schedule}/>
            </div>
        </Fragment>
    )
}