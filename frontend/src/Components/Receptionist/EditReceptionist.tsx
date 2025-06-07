import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { ReceptionistModel } from '../../Interfaces/ReceptionistModel';
import { ReceptionistService } from '../../Services/ReceptionistService';

export default function EditReceptionist() {
  const { id } = useParams<{ id: string }>();
  const [values, setValues] = useState<ReceptionistModel>({
    id:id!,
    responsibilities: '',
    userId: '',
  });

  const navigate = useNavigate();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const response = await ReceptionistService.GetReceptionistDetails(id);
        const data = response;
        setValues({
          id: data.id,
          responsibilities: data.responsibilities,
          userId: data.userId,
        });
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const model: ReceptionistModel = {
        id: values.id,
        responsibilities: values.responsibilities,
        userId: values.userId,
      };

      await axios.post("https://localhost:7085/api/Receptionist", model);
      setIsUpdated(true);
      sendToOverview();
    } catch (error) {
      console.error("Error creating/updating receptionist:", error);
    }
  };

  const sendToOverview = () => {
    navigate('/receptionist');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      <h1 style={{ marginLeft: "15px", fontFamily: "Georgia", color: "black" }}>
        {values.id ? 'Edit' : 'Add'} Receptionist
      </h1>
      <p style={{ marginLeft: "15px", color: "#555", fontSize: "14px" }}>
        Please fill out the form below to {values.id ? 'edit' : 'create'} a Receptionist.
      </p>
      <Segment clearing style={{ margin: "30px 30px 0 10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", border: "1px solid rgb(15 179 126 / 87%)" }}>
        <form className='ui form' style={{ backgroundColor: "#f9f9f9", padding: "20px" }} onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Responsibilities</label>
            <input
              style={{ padding: "5px", margin: "5px" }}
              type="text"
              placeholder="Responsibilities"
              className="form-control"
              name="responsibilities"
              value={values.responsibilities || ''}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button
              type="button"
              onClick={sendToOverview}
              className="ui blue basic button"
              style={{ backgroundColor: "rgb(32 76 60)", color: "#fff" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ui green button"
              style={{ backgroundColor: "rgb(32 76 60)", color: "#fff" }}
            >
              Submit
            </button>
          </div>
        </form>
      </Segment>
      <br />
      <br />
    </>
  );
}
