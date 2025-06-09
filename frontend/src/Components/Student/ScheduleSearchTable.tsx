import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
import { CourseLecturesService } from "../../Services/CourseLecturesService";
import { GroupService } from "../../Services/GroupService";
import { HallService } from "../../Services/HallService";
import { LocationService } from "../../Services/LocationService";
import { DepartmentService } from "../../Services/DepartmentService";
import { ScheduleSearchModel } from "../../Interfaces/ScheduleSearchModel";
import { Button } from "semantic-ui-react";
import ScheduleSearchService from "../../Services/ScheduleSearchService";
import { ManualScheduleModel } from "../../Interfaces/ManualScheduleModel";

export default function ScheduleSearchTable({ onResults }: { onResults: (data: ManualScheduleModel[]) => void})
{
    const mapTo = (data: any[]): { value: any; label: string }[] => 
        data.map((item) => ({ value: item.id, label: item.name }));
    const [courseLecture, setCourseLecture] = useState<{ value: any; label: string }[]>([]);
    const [group, setGroup] = useState<{ value: any; label: string }[]>([]);
    const [hall, setHall] = useState<{ value: any; label: string }[]>([]);
    const [location, setLocation] = useState<{ value: any; label: string }[]>([]);
    const [department, setDepartment] = useState<{ value: any; label: string }[]>([]);
    const [searchParams, setSearchParams] = useState<ScheduleSearchModel>({
        day: "",
        startTime: "",
        endTime: "",
        hallsId: [],
        locationId: [],
        departmentId:  [],
        groupId:  [],
        courseLecturesId:  [],
        searchText: "",
        sortBy: "",
        sortDescending: false,
        pageNumber: 1,
        pageSize: 10,
    });
    const [schedules, setSchedules] = useState<ManualScheduleModel[]>([]);
    const [sorting, setSorting] = useState<boolean>(false);

    const days = [
        { value: 'Monday', label: 'Monday' },       
        { value: 'Tuesday', label: 'Tuesday' },     
        { value: 'Wednesday', label: 'Wednesday' }, 
        { value: 'Thursday', label: 'Thursday' },   
        { value: 'Friday', label: 'Friday' },       
        { value: 'Saturday', label: 'Saturday' },  
    ];
    const startTime = [
        { value: '09:00', label: '09:00' },
        { value: '10:40', label: '10:40' },
        { value: '12:40', label: '12:40' },
        { value: '14:20', label: '14:20' },
        { value: '16:00', label: '16:00' },
        { value: '17:40', label: '17:40' },
        { value: '19:20', label: '19:20' },
    ];
    const endTime = [
        { value: '10:30', label: '10:30' },
        { value: '12:10', label: '12:10' },
        { value: '14:10', label: '14:10' },
        { value: '15:50', label: '15:50' },
        { value: '17:30', label: '17:30' },
        { value: '19:10', label: '19:10' },
        { value: '20:50', label: '20:50' },
    ];
    const sortOptions = [
        { value: 'day', label: 'Day' },
        { value: 'starttime', label: 'Start Time' },
        { value: 'endtime', label: 'End Time' },
        { value: 'name', label: 'Name' },
        { value: 'lastname', label: 'LastName' },
        { value: 'group', label: 'Group' },
        { value: 'hall', label: 'Hall' },
        { value: 'location', label: 'Location' },
        { value: 'department', label: 'Department'}
    ];

    useEffect(() => {
        let isFetched = false;
        const fetchData = async () => {
            try
            {
                const [courseLectureR, groupR, hallR, locationR, departmentR] = await Promise.all([
                    CourseLecturesService.GetSelectList(),
                    GroupService.GetSelectList(),
                    HallService.GetSelectList(),
                    LocationService.GetSelectList(),
                    DepartmentService.GetSelectList()
                ]);
                if (!isFetched)
                {
                    setCourseLecture(mapTo(courseLectureR));
                    setGroup(mapTo(groupR));
                    setHall(mapTo(hallR));
                    setLocation(mapTo(locationR));
                    setDepartment(mapTo(departmentR));
                }
            }
            catch (err) 
            {
                console.error("Listat nuk u ngarkuan!", err);
            }
        };
        fetchData();
        return () => {
            isFetched = true; 
        };
    }, []);
    const handleSubmit = async () => 
    {
        const data = await ScheduleSearchService.getSchedulesByFilter(searchParams);
        console.log("Kërkesa që po dërgohet:", searchParams);
        setSchedules(data);
        onResults(data);
    };
    const isSearchEnabled = () => {
        if (searchParams.day) return true;
        if (searchParams.startTime) return true;
        if (searchParams.endTime) return true;
        if (searchParams.courseLecturesId && searchParams.courseLecturesId.length > 0) return true;
        if (searchParams.groupId && searchParams.groupId.length > 0) return true;
        if (searchParams.hallsId && searchParams.hallsId.length > 0) return true;
        if (searchParams.locationId && searchParams.locationId.length > 0) return true;
        if (searchParams.departmentId && searchParams.departmentId.length > 0) return true;
        if (searchParams.searchText && searchParams.searchText.trim() !== "") return true;
        return false;
    };
    return (
        <Fragment>
            <div style={{ width: '600px', marginLeft: '10%' }}>
                 <input type="text" placeholder="Search text..." value={searchParams.searchText!}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, searchText: e.target.value,}))}
                    style={{ padding: "10px", width: "95%", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc",}}/>
                <div style={{ marginBottom: '10px', display: 'flex', gap: '20px' }}>
                    <Select options={sortOptions} placeholder="Sort by..."
                        value={sortOptions.find(opt => opt.value === searchParams.sortBy) || null}
                        onChange={(e) => { setSearchParams(prev => ({...prev, sortBy: e?.value || "", })); setSorting(true); }}
                        styles={{ menuList: base => ({ ...base, maxHeight: '120px', overflowY: 'auto' }) }}/>
                    <Select options={[{ value: false, label: "Ascending" }, { value: true, label: "Descending" },]}
                        placeholder="Order"
                        value={searchParams.sortDescending ? { value: true, label: "Descending" } : { value: false, label: "Ascending" }}
                        onChange={(e) => {setSearchParams(prev => ({...prev, sortDescending: e?.value ?? false}));  setSorting(true); }}
                        styles={{ menuList: base => ({ ...base, maxHeight: '120px', overflowY: 'auto' }) }}/>
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', gap: '20px',  }}>
                    <Select options={days} placeholder="Day" 
                        value={days.find(d => d.value === searchParams.day) || null}
                        onChange={(e) => { setSearchParams(prev => ({ ...prev, day: e?.value || "" }))}}
                        styles={{menuList: (base) => ({ ...base, maxHeight: '120px',overflowY: 'auto',}),}}/>
                    <Select options={startTime} placeholder="Start" 
                    value={startTime.find(sT => sT.value === searchParams.startTime) || null}
                    onChange={(e) => { setSearchParams(prev => ({ ...prev, startTime: e?.value || "" }))}}
                    styles={{menuList: (base) => ({ ...base, maxHeight: '120px',overflowY: 'auto',}),}}/>
                    <Select options={endTime} placeholder="End" 
                        value={endTime.find(eT => eT.value === searchParams.endTime) || null}
                        onChange={(e) => { setSearchParams(prev => ({ ...prev, endTime: e?.value || "" }))}}
                        styles={{menuList: (base) => ({ ...base, maxHeight: '120px',overflowY: 'auto',})}}/>
                    <Select options={courseLecture} isMulti placeholder="Courses"
                        value={courseLecture.filter(item => searchParams.courseLecturesId!.includes(item.value))} 
                        onChange={(e) => {const selectedIds = e?.map(option => option.value) || [];
                            setSearchParams(prev => ({ ...prev, courseLecturesId: selectedIds}))}}
                        styles={{menuList: (base) => ({ ...base, maxHeight: '120px',overflowY: 'auto',})}}/> 
                </div>
                <div style={{ marginBottom: '10px', display: 'flex',  gap: '20px', }}>
                    <Select options={group} isMulti placeholder="Groups"
                        value={group.filter(item => searchParams.groupId!.includes(item.value))}
                        onChange={(e) => {const selectedIds = e?.map(option => option.value) || []; 
                            setSearchParams(prev => ({ ...prev, groupId: selectedIds}))}} 
                        styles={{menuList: (base) => ({ ...base, maxHeight: '120px',overflowY: 'auto',})}}/>
                    <Select options={hall} isMulti placeholder="Halls"
                        value={hall.filter(item => searchParams.hallsId!.includes(item.value))} 
                        onChange={(e) => {const selectedIds = e?.map(option => option.value) || []; 
                            setSearchParams(prev => ({ ...prev, hallsId: selectedIds}))}}
                        styles={{menuList: (base) => ({ ...base, maxHeight: '120px',overflowY: 'auto',})}}/>
                    <Select options={location} isMulti placeholder="Locations"
                        value={location.filter(item => searchParams.locationId!.includes(item.value))}
                        onChange={(e) => {const selectedIds = e?.map(option => option.value) || []; 
                            setSearchParams(prev => ({ ...prev, locationId: selectedIds}))}} 
                        styles={{menuList: (base) => ({ ...base, maxHeight: '120px',overflowY: 'auto',})}}/>
                    <Select options={department} isMulti placeholder="Departments"
                        value={department.filter(item => searchParams.departmentId!.includes(item.value))}
                        onChange={(e) => {const selectedIds = e?.map(option => option.value) || []; 
                            setSearchParams(prev => ({ ...prev, departmentId: selectedIds}))}}
                        styles={{menuList: (base) => ({ ...base, maxHeight: '120px',overflowY: 'auto',})}}/> 
                </div>
                <div style={{ marginBottom: '10px' }}>
                   
                </div>
                {(isSearchEnabled() || sorting)  && 
                    <Button style={{backgroundColor: "#34495e", color: "white", marginLeft: '25%'}} onClick={handleSubmit}>
                        Search
                    </Button>
                }
                { (schedules.length > 0 || sorting) && (
                        <Button color="red"onClick={() => { onResults([]); setSchedules([]); setSorting(false);
                            setSearchParams({day: "",
                                            startTime: "",
                                            endTime: "",
                                            hallsId: [],
                                            locationId: [],
                                            departmentId: [],
                                            groupId: [],
                                            courseLecturesId: [],
                                            searchText: "",
                                            sortBy: "",
                                            sortDescending: false,
                                            pageNumber: 1,
                                            pageSize: 10,})}}>
                            Cancel 
                        </Button>
                )}
            </div>
        </Fragment>
    );
}
