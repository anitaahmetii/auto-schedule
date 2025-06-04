import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { ReportModel } from '../../Interfaces/ReportModel';
import { SelectListItem } from '../../Interfaces/SelectListItem';
import { UserService } from '../../Services/UserService';

export default function EditReport() {
  const { reportId, scheduleId } = useParams<{ reportId?: string; scheduleId?: string }>();
  const [values, setValues] = useState<ReportModel>({
    id: '',
    absence: 0,
    comment: '',
    dateTime: '',
    userId: '',
    scheduleId: scheduleId ?? '',
  });

  console.log(reportId)
  console.log(scheduleId)
  const [userList, setUserList] = useState<SelectListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // Add this success state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) {
        setErrorMessage('Report ID is not available.');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7085/api/Report/${reportId}`);
        const data: ReportModel = response.data;

        setValues({
          id: data.id,
          absence: data.absence,
          comment: data.comment,
          dateTime: data.dateTime,
          userId: data.userId,
          scheduleId: data.scheduleId,
        });
      } catch (error) {
        setErrorMessage('Error fetching report data.');
      }
    };

    fetchReport();
  }, [reportId, scheduleId]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await UserService.GetSelectList();
  
        const filteredList = response
          .filter((item) => item.role === 2) // vetëm recepsionistët
          .map((item, i) => ({
            key: i,
            value: item.id,
            text: item.userName,
          }) as SelectListItem);
  
        setUserList(filteredList);
      } catch (error) {
        setErrorMessage('Error fetching user list.');
      }
    };
  
    fetchUserList();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const model = {
      id: values.id || null,
      absence: values.absence,
      comment: values.comment,
      dateTime: values.dateTime,
      userId: values.userId,
      scheduleId: values.scheduleId || null,
    };
  
    try {
      await axios.post('https://localhost:7085/api/Report', model);

  
      setIsSuccess(true);
      sendToReports();
    } catch (error) {
      console.error('Error saving report:', error);
      setErrorMessage('Error saving report.');
    }
  };
  
  function sendToReports() {
    navigate('/reports');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };


  return (
    <>
      <h1 style={{ marginLeft: '15px', fontFamily: 'Georgia', color: 'black' }}>
        {reportId ? 'Edit' : 'Add'} Report
      </h1>
      <p style={{ marginLeft: '15px', color: '#555', fontSize: '14px' }}>
        Please fill out the form below to {reportId ? 'edit' : 'create'} a Report.
      </p>
      {errorMessage && <div style={{ color: 'red', marginLeft: '15px' }}>{errorMessage}</div>}
      <Segment clearing style={{ margin: '30px 30px 0 10px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', border: '1px solid rgb(15 179 126 / 87%)' }}>
        <form className="ui form" style={{ backgroundColor: '#f9f9f9', padding: '20px' }} onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Absence</label>
            <input
              style={{ padding: '5px', margin: '5px' }}
              type="number"
              placeholder="Absence count"
              className="form-control"
              name="absence"
              value={values.absence}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea
              style={{ padding: '5px', margin: '5px' }}
              placeholder="Enter comment"
              className="form-control"
              name="comment"
              value={values.comment}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Date and Time</label>
            <input
  type="datetime-local"
  className="form-control"
  name="dateTime"
  value={values.dateTime ? values.dateTime.slice(0, 16) : ''} // formaton si duhet
  onChange={handleChange}
/>
          </div>

          <div className="col-md-6-w-100%">
            <label>User</label>
            <select
              className="form-control"
              name="userId"
              id="userId"
              value={values.userId || ''}
              onChange={handleSelectChange}
              style={{ marginBottom: '15px' }}
            >
              <option value="" disabled>Select User</option>
              {userList.map((x) => (
                <option key={x.key} value={x.value!}>
                  {x.text}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
              Schedule ID
            </label>
            <input
              type="text"
              name="scheduleId"
              value={values.scheduleId || ''}
              onChange={handleChange}
              placeholder="Enter Schedule ID"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginBottom: '15px',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => navigate('/reports')} className="ui blue basic button" style={{ backgroundColor: 'rgb(32 76 60)', color: '#fff' }}>
              Cancel
            </button>
            <button type="submit" className="ui green button" style={{ backgroundColor: 'rgb(32 76 60)', color: '#fff' }}>
              Submit
            </button>
          </div>
        </form>
      </Segment>
    </>
  );
}
