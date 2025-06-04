import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ManualScheduleModel } from '../../Interfaces/ManualScheduleModel';
import { ManualScheduleService } from '../../Services/ManualScheduleService';
import { DepartmentService } from '../../Services/DepartmentService';
import { SelectListItem } from '../../Interfaces/SelectListItem';
import { HallService } from '../../Services/HallService';
import { LocationService } from '../../Services/LocationService';
import { GroupService } from '../../Services/GroupService';
import { CourseLecturesService } from '../../Services/CourseLecturesService';
import { CourseLecturesModel } from '../../Interfaces/CourseLecturesModel';
import { GroupModel } from '../../Interfaces/GroupModel';
import { HallModel } from '../../Interfaces/HallModel';
import { LocationModel } from '../../Interfaces/LocationModel';
import { DepartmentModel } from '../../Interfaces/DepartmentModel';

export default function AddTemporarySchedule() {
    const [departmentList, setDepartmentList] = useState<SelectListItem[]>([]);
    const [hallList, setHallList] = useState<SelectListItem[]>([]);
    const [locationList, setLocationList] = useState<SelectListItem[]>([]);
    const [groupList, setGroupList] = useState<SelectListItem[]>([]);
    const [courseLectureList, setCourseLectureList] = useState<SelectListItem[]>([]);

    const [courseLecturesList, setCourseLecturesList] = useState<CourseLecturesModel[]>([]);
    const [groupsList, setGroupsList] = useState<GroupModel[]>([]);
    const [hallsList, setHallsList] = useState<HallModel[]>([]);
    const [locationsList, setLocationsList] = useState<LocationModel[]>([]);
    const [departmentsList, setDepartmentsList] = useState<DepartmentModel[]>([]);
  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    department: '',
    halls: '',
    location: '',
    group: '',
    courseLecture: '',
  });

  const [schedules, setSchedules] = useState<ManualScheduleModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
            let fetched = false;
            const fetchAll = async () => {
                try 
                {
                    const [cLR, gR, hR, lR, dR] = await Promise.all([
                        CourseLecturesService.GetSelectList(),
                        GroupService.GetSelectList(),
                        HallService.GetSelectList(),
                        LocationService.GetSelectList(),
                        DepartmentService.GetSelectList(),
                    ]);
                    if (!fetched)
                    {
                        setCourseLecturesList(cLR);
                        setGroupsList(gR);
                        setHallsList(hR);
                        setLocationsList(lR);
                        setDepartmentsList(dR);
                    }
                }
                catch (err) 
                {
                    console.error("Lists could not be loaded!", err);
                };
            };
            fetchAll();
            return () => {
                fetched = true;
            };
        }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      const data = await ManualScheduleService.getAllManualSchedulesAsync();
      setSchedules(data);
    };
    fetchSchedules();
  }, []);

  const fetchDepartmentList = async () => {
    const response = await DepartmentService.GetSelectList();
  
    setDepartmentList(response.map((item,i)=>({
      key: i,
      value: item.name,
      text: item.name
    } as SelectListItem)).filter(x=>x.text != '' &&x.text != null));
  }
  useEffect(() => {
    fetchDepartmentList();
  }, []);

  const fetchHallList = async () => {
    const response = await HallService.GetSelectList();
  
    setHallList(response.map((item,i)=>({
      key: i,
      value: item.name,
      text: item.name
    } as SelectListItem)).filter(x=>x.text != '' &&x.text != null));
  }
  useEffect(() => {
    fetchHallList();
  }, []);

  const fetchLocationList = async () => {
    const response = await LocationService.GetSelectList();
  
    setLocationList(response.map((item,i)=>({
      key: i,
      value: item.name,
      text: item.name
    } as SelectListItem)).filter(x=>x.text != '' &&x.text != null));
  }
  useEffect(() => {
    fetchLocationList();
  }, []);

  const fetchGroupList = async () => {
    const response = await GroupService.GetSelectList();
  
    setGroupList(response.map((item,i)=>({
      key: i,
      value: item.name,
      text: item.name
    } as SelectListItem)).filter(x=>x.text != '' &&x.text != null));
  }
  useEffect(() => {
    fetchGroupList();
  }, []);

  const fetchCourseLectureList = async () => {
    const response = await CourseLecturesService.GetSelectList();
  
    setCourseLectureList(response.map((item,i)=>({
      key: i,
      value: item.name,
      text: item.name
    } as SelectListItem)).filter(x=>x.text != '' &&x.text != null));
  }
  useEffect(() => {
    fetchCourseLectureList();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const { courseLecture, department, location, group } = formData;

  console.log(formData)
  console.log(schedules)
  // Try to find a schedule that matches ALL 4 fields
  const matchedSchedule = schedules.find(
    (s) =>
      courseLecturesList.find(c => c.id === s.courseLecturesId)?.name === courseLecture &&
      departmentsList.find(d => d.id === s.departmentId)?.name === department &&
      locationsList.find(l => l.id === s.locationId)?.name === location &&
      groupsList.find(g => g.id === s.groupId)?.name === group
  );
  console.log(matchedSchedule)

  if (!matchedSchedule) {
    alert("No schedule found matching the selected courselectures, department, location, and group.");
    return; // Stop here, don't allow save
  }

  // Build the temporary schedule based on matched schedule
  const tempSchedule = {
    ...formData,
    id: matchedSchedule.id,
    createdAt: new Date().toISOString(),
    halls: formData.halls || matchedSchedule.hallsId || '',
  };

  // Get today's temp schedules
  const existing = JSON.parse(localStorage.getItem('tempSchedules') || '[]');
  const validTempSchedules = existing.filter(
    (s: any) => new Date(s.createdAt).toDateString() === new Date().toDateString()
  );

  validTempSchedules.push(tempSchedule);
  localStorage.setItem('tempSchedules', JSON.stringify(validTempSchedules));

  // Redirect
  navigate('/OrariDitor');
};

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Shto Orar të Përkohshëm</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        {/* Dita */}
        <div className="col-md-6">
          <label className="form-label">Dita</label>
          <select className="form-select" name="day" value={formData.day} onChange={handleChange} required>
            <option value="">Zgjedh ditën</option>
            <option value="Monday">E Hënë</option>
            <option value="Tuesday">E Martë</option>
            <option value="Wednesday">E Mërkurë</option>
            <option value="Thursday">E Enjte</option>
            <option value="Friday">E Premte</option>
            <option value="Saturday">E Shtunë</option>
          </select>
        </div>

        {/* Orari i Fillimit */}
        <div className="col-md-6">
          <label className="form-label">Ora e Fillimit</label>
          <input
            type="datetime-local"
            className="form-control"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* Orari i Mbarimit */}
        <div className="col-md-6">
          <label className="form-label">Ora e Mbarimit</label>
          <input
            type="datetime-local"
            className="form-control"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* Departamenti */}
        <div className="col-md-6-w-100%">
              <select className="form-control"
                name="department" 
                id="department"
                value= {formData.department || ""}
                onChange={handleChange}
                style={{ marginBottom: "15px"}}
                >
                  <option value="" disabled>Select Department</option>
                  {departmentList.map((x) => (
                    <option key={x.key} value={x.value!}>{x.text}</option>
                  ))}
                </select>
          </div>

        {/* Salla */}
        <div className="col-md-6-w-100%">
              <select className="form-control"
                name="halls" 
                id="halls"
                value= {formData.halls || ""}
                onChange={handleChange}
                style={{ marginBottom: "15px"}}
                >
                  <option value="" disabled>Select Hall</option>
                  {hallList.map((x) => (
                    <option key={x.key} value={x.value!}>{x.text}</option>
                  ))}
                </select>
          </div>

        {/* Lokacioni */}
        <div className="col-md-6-w-100%">
              <select className="form-control"
                name="location" 
                id="location"
                value= {formData.location || ""}
                onChange={handleChange}
                style={{ marginBottom: "15px"}}
                >
                  <option value="" disabled>Select Location</option>
                  {locationList.map((x) => (
                    <option key={x.key} value={x.value!}>{x.text}</option>
                  ))}
                </select>
          </div>

        {/* Grupi */}
        <div className="col-md-6-w-100%">
              <select className="form-control"
                name="group" 
                id="group"
                value= {formData.group || ""}
                onChange={handleChange}
                style={{ marginBottom: "15px"}}
                >
                  <option value="" disabled>Select Group</option>
                  {groupList.map((x) => (
                    <option key={x.key} value={x.value!}>{x.text}</option>
                  ))}
                </select>
          </div>

        {/* Lënda / Ligjërata */}
        <div className="col-md-6-w-100%">
              <select className="form-control"
                name="courseLecture" 
                id="courseLecture"
                value= {formData.courseLecture || ""}
                onChange={handleChange}
                style={{ marginBottom: "15px"}}
                >
                  <option value="" disabled>Select Course Lectures</option>
                  {courseLectureList.map((x) => (
                    <option key={x.key} value={x.value!}>{x.text}</option>
                  ))}
                </select>
          </div>

        {/* Butoni Submit */}
        <div className="col-12 text-center mt-3">
          <button type="submit" className="btn btn-primary px-5">
            Shto Orarin
          </button>
        </div>
      </form>
    </div>
  );
}
