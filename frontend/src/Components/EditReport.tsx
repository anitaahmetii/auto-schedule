import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReportModel } from '../Interfaces/ReportModel';
import { ReportService } from '../Services/ReportService';

export default function EditReport() {
  const { id } = useParams<{ id: string }>();
  const [values, setValues] = useState<ReportModel>({
    id: id!,
    absence: 0,
    comment: '',
    dateTime: '',
    userId: '', // Default to empty string
    scheduleId: '', // Default to empty string
  });

  const [users, setUsers] = useState<any[]>([]); // Users dropdown options
  const [schedules, setSchedules] = useState<any[]>([]); // Schedules dropdown options

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Merrni të gjithë raportet
        const reports = await ReportService.GetAllReports();
        
        // Gjeni raportin që përputhet me id
        const report = reports.find(r => r.id === id);
  
        if (report) {
          setValues({
            id: report.id,
            absence: report.absence,
            comment: report.comment,
            dateTime: report.dateTime,
            userId: report.userId || '',
            scheduleId: report.scheduleId || '',
          });
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      }
  
      // Fetch users dhe schedules për dropdown
      try {
        const userResponse = await axios.get('https://localhost:7085/api/Users');
        setUsers(userResponse.data);
  
        const scheduleResponse = await axios.get('https://localhost:7085/api/Schedules');
        setSchedules(scheduleResponse.data);
      } catch (error) {
        console.error('Error fetching users or schedules:', error);
      }
    };
  
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const model = {
        id: values.id!,
        absence: values.absence,
        comment: values.comment,
        dateTime: values.dateTime,
        userId: values.userId,
        scheduleId: values.scheduleId,
      } as ReportModel;

      await ReportService.EditOrAddReport(model); // Save the report
      navigate('/'); // Redirect to overview page
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value || '' });
  };

  return (
    <>
      <h1 style={{ marginLeft: '15px', fontFamily: 'Georgia', color: 'black' }}>
        {values.id != null ? 'Edit' : 'Add'} Report
      </h1>
      <p style={{ marginLeft: '15px', color: '#555', fontSize: '14px' }}>
        Please fill out the form below to {values.id != null ? 'edit' : 'create'} a Report.
      </p>

      <form className='ui form' style={{ backgroundColor: '#f9f9f9', padding: '20px' }} onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label>Absence</label>
          <input
            style={{ padding: '5px', margin: '5px' }}
            type="number"
            placeholder="Absence"
            className="form-control"
            name="absence"
            value={values.absence}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Comment</label>
          <input
            style={{ padding: '5px', margin: '5px' }}
            type="text"
            placeholder="Comment"
            className="form-control"
            name="comment"
            value={values.comment}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date/Time</label>
          <input
            style={{ padding: '5px', margin: '5px' }}
            type="datetime-local"
            className="form-control"
            name="dateTime"
            value={values.dateTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>User</label>
          <select
            name="userId"
            value={values.userId}
            onChange={handleChange}
            required
            style={{ padding: '5px', margin: '5px' }}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Schedule</label>
          <select
            name="scheduleId"
            value={values.scheduleId}
            onChange={handleChange}
            required
            style={{ padding: '5px', margin: '5px' }}
          >
            <option value="">Select Schedule</option>
            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => navigate('/')} // Cancel button
            className="ui blue basic button"
            style={{ backgroundColor: 'rgb(32 76 60)', color: '#fff' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ui green button"
            style={{ backgroundColor: 'rgb(32 76 60)', color: '#fff' }}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}