import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { ReportModel } from '../../Interfaces/ReportModel';
import { UserService } from '../../Services/UserService';
import { ManualScheduleService } from '../../Services/ManualScheduleService';
import { SelectListItem } from '../../Interfaces/SelectListItem';

export default function AddRaportetAnuluara() {
  const { reportId, scheduleId } = useParams<{ reportId?: string; scheduleId?: string }>();
  const [values, setValues] = useState<ReportModel>({
    id: '',
    absence: 0,
    comment: '', // Default comment indicating cancellation
    dateTime: '',
    userId: '',
    scheduleId: scheduleId ?? '',
  });

  const [userList, setUserList] = useState<SelectListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (reportId) {
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
        } else if (scheduleId) {
          // If creating, just prefill the scheduleId
          setValues((prev) => ({ ...prev, scheduleId }));
        }
      } catch (error) {
        setErrorMessage("Failed to load report data.");
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
      comment: values.comment,  // Cancelation message will be here
      dateTime: values.dateTime,
      userId: values.userId,
      scheduleId: values.scheduleId || null,
    };

    try {
      // Here you would send a cancellation report, updating the database
      await axios.post('https://localhost:7085/api/Report', model);

      await ManualScheduleService.CancelSchedule(values.scheduleId);
      setIsSuccess(true);
      navigate('/RaportetAnuluara');  // Navigate to the page that lists canceled reports
    } catch (error) {
      console.error('Error saving report:', error);
      setErrorMessage('Error saving report.');
    }
  };

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
        {reportId ? 'Edit' : 'Add'} Canceled Report
      </h1>
      <p style={{ marginLeft: '15px', color: '#555', fontSize: '14px' }}>
        Please fill out the form below to {scheduleId ? 'edit' : 'create'} a cancellation report.
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
            <label>Comment (Cancellation Reason)</label>
            <textarea
              style={{ padding: '5px', margin: '5px' }}
              placeholder="Enter cancellation comment"
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
              value={values.dateTime ? values.dateTime.slice(0, 16) : ''} 
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
              readOnly
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
            <button type="button" onClick={() => navigate('/RaportetAnuluara')} className="ui blue basic button" style={{ backgroundColor: 'rgb(32 76 60)', color: '#fff' }}>
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
