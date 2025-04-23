import React, { useEffect, useState } from 'react';
import { ScheduleService } from '../../Services/ScheduleService';
import { ScheduleModel } from '../../Interfaces/ScheduleModel';
import { Button, Confirm, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
export default function ScheduleTable(){
  const [file, setFile] = useState<File | null>(null);
  const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteScheduleId, setDeleteScheduleId] = useState<string>("");


   useEffect(()=>{
      const fetchData = async () => {
        const result = await ScheduleService.GetAllSchedules();
        setSchedules(result);
      };
      fetchData();
    }, []);

     function deleteSchedule(id: string) {
        setOpenConfirm(true);
        setDeleteScheduleId(id);
      }
    
      async function confirmedDeleteSchedule(id: string) {
        var result = await ScheduleService.DeleteSchedule(id);
        setSchedules(schedules.filter((schedule) => schedule.id !== id));
        setOpenConfirm(false);
        setDeleteScheduleId("");
      }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const importedSchedules = await ScheduleService.ImportSchedule(file);
      setSchedules(importedSchedules);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const navigate = useNavigate();
  function sendToDetails(id:string | null) {
    navigate(`/EditSchedule/${id}`);
  }
  return (
    <div className="container mt-4">
        <h1>Schedule</h1>
      <h4>Import Schedule</h4>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button onClick={handleUpload} className="btn btn-primary mt-2">Upload</button>

      {schedules.length > 0 && (
        <Table striped>
        <TableHeader>
          <TableRow>
          <TableHeaderCell>Day</TableHeaderCell>
          <TableHeaderCell>Start</TableHeaderCell>
          <TableHeaderCell>End</TableHeaderCell>
          {/* <TableHeaderCell>Course</TableHeaderCell> */}
          <TableHeaderCell>Department</TableHeaderCell>
          {/* <TableHeaderCell>Hall</TableHeaderCell>  */}
          <TableHeaderCell>Location</TableHeaderCell> 
          {/* <TableHeaderCell>Group</TableHeaderCell>  */}
          <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
          <TableBody>
          {schedules.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.day}</TableCell>
              <TableCell>{new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  hour12: false })}</TableCell>
              <TableCell>{new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  hour12: false })}</TableCell>
              {/* <TableCell>{item.userName}</TableCell> */}
              <TableCell>{item.department}</TableCell>
              {/* <TableCell>{item.hall}</TableCell> */}
              <TableCell>{item.location}</TableCell>
              {/* <TableCell>{item.group}</TableCell> */}
              <TableCell>
                <Button
                  type="button"
                className="btn ui green basic button"
               onClick={() => sendToDetails(item.id!)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="btn btn-danger"
                  negative
                  onClick={() => deleteSchedule(item.id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <Confirm
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={() => confirmedDeleteSchedule(deleteScheduleId!)}
          />
        </TableBody>
      </Table>
      )}
    </div>
  );
}