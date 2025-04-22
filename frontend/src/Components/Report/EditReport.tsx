import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReportModel } from '../../Interfaces/ReportModel';
import { ReportService } from '../../Services/ReportService';

export default function EditReport() {
  const { id } = useParams<{ id: string }>();
  const [values, setValues] = useState<ReportModel>({
    id: id!,
    absence: 0,
    comment: '',
    dateTime: '',
    userId: '', // Default to empty string
    scheduleId: '', // Use ScheduleTypeId instead of scheduleId
  });

  const [users, setUsers] = useState<any[]>([]); // Users dropdown options
  const [scheduleTypes, setScheduleTypes] = useState<any[]>([]); // ScheduleTypes dropdown options

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the report data
        const reports = await ReportService.GetAllReports();
        const report = reports.find((r) => r.id === id);

        if (report) {
          setValues({
            id: report.id,
            absence: report.absence,
            comment: report.comment,
            dateTime: report.dateTime,
            userId: report.userId || '',  // Set userId if available
            scheduleId: report.scheduleId || '', // Set scheduleTypeId if available
          });
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      }

      // Fetch users and scheduleTypes for dropdown
      try {
        const userResponse = await axios.get('https://localhost:7085/api/User');
        setUsers(userResponse.data);

        const scheduleTypeResponse = await axios.get('https://localhost:7085/api/ScheduleType');
        setScheduleTypes(scheduleTypeResponse.data);
      } catch (error) {
        console.error('Error fetching users or scheduleTypes:', error);
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
        scheduleId: values.scheduleId, // Use scheduleTypeId instead of scheduleId
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

      <form
        className="ui form"
        style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="form-group">
          <label>Absence</label>
          <input
            type="number"
            placeholder="Absence"
            className="form-control"
            name="absence"
            value={values.absence}
            onChange={handleChange}
            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label>Comment</label>
          <input
            type="text"
            placeholder="Comment"
            className="form-control"
            name="comment"
            value={values.comment}
            onChange={handleChange}
            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label>Date/Time</label>
          <input
            type="datetime-local"
            className="form-control"
            name="dateTime"
            value={values.dateTime}
            onChange={handleChange}
            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label>User</label>
          <select
            name="userId"
            value={values.userId}
            onChange={handleChange}
            required
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              borderRadius: '4px',
            }}
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
          <label>Schedule Type</label>
          <select
            name="scheduleId"  // Këtu ndryshojmë emrin në "scheduleId"
            value={values.scheduleId}  // Këtu lidhim vlerën me gjendjen e komponentit (scheduleId)
            onChange={handleChange}  // Kujdes që të ruhet vlera e re në gjendje
            required
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              borderRadius: '4px',
            }}
          >
            <option value="">Select Schedule Type</option>
            {scheduleTypes.map((scheduleType) => (
              <option key={scheduleType.id} value={scheduleType.id}>
                {scheduleType.name}  // Emri i schedule type që do të shfaqet
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ width: '120px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success"
            style={{ width: '120px' }}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}