import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { UserModel } from '../../Interfaces/UserModel';
import { UserService } from '../../Services/UserService'; // Ky do të jetë shërbimi për API për përdoruesit

export default function EditUser() {
  const { id } = useParams<{ id: string }>(); // Merr id nga URL
  const [values, setValues] = useState<UserModel>({
    id: id!,
    userName: '',
    email: '',
    phoneNumber: '',
    password: '', // Përdoruesi mund të editoni password-in nëse është e nevojshme
  });

  const navigate = useNavigate();
  const [state, setState] = useState(false);

  // Përdorimi i useEffect për të marrë të dhënat për përdoruesin që po editohet
  useEffect(() => {
    const fetchData = async () => {
      if (id != null) {
        const response = await UserService.GetUserDetails(id!); // Merr detajet e përdoruesit nga shërbimi
        const userData = response;
        setValues({
          id: userData.id,
          userName: userData.userName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          password: '', // Përsëri, password mund të jetë i ri ose i pa prekur
        });
      }
    };

    fetchData();
  }, [id]);

  // Funksioni për të dërguar formulën (krijuar/edituar përdoruesin)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let model = {
        id: values.id!,
        userName: values.userName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password, // Sigurohuni që password të jetë i vlefshëm kur editohet
      };

      const response = await axios.post(
        "https://localhost:7085/api/User", // API URL për krijimin ose përditësimin e përdoruesit
        model
      );
      setState(true);
      sendToOverview();
    } catch (error) {
      console.error("Error creating/updating user:", error);
    }
  };

  const sendToOverview = () => {
    navigate('/'); // Dërgon përdoruesin në faqen e përmbledhjes pas përfundimit
  };

  // Funksioni për të përditësuar vlerat e fushave kur përdoruesi bën ndryshime
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      <h1 style={{ marginLeft: "15px", fontFamily: "Georgia", color: "black" }}>
        {values.id != null ? 'Edit' : 'Add'} User
      </h1>
      <p style={{ marginLeft: "15px", color: "#555", fontSize: "14px" }}>
        Please fill out the form below to {values.id != null ? 'edit' : 'create'} a User.
      </p>
      <Segment clearing style={{ margin: "30px 30px 0 10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", border: "1px solid rgb(15 179 126 / 87%)" }}>
        <form className="ui form" style={{ backgroundColor: "#f9f9f9", padding: "20px" }} onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>User Name</label>
            <input
              style={{ padding: "5px", margin: "5px" }}
              type="text"
              placeholder="User Name"
              className="form-control"
              id="userName"
              name="userName"
              value={values.userName!}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              style={{ padding: "5px", margin: "5px" }}
              type="email"
              placeholder="Email"
              className="form-control"
              id="email"
              name="email"
              value={values.email!}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              style={{ padding: "5px", margin: "5px" }}
              type="text"
              placeholder="Phone Number"
              className="form-control"
              id="phoneNumber"
              name="phoneNumber"
              value={values.phoneNumber!}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password (Leave empty if you don't want to change)</label>
            <input
              style={{ padding: "5px", margin: "5px" }}
              type="password"
              placeholder="Password"
              className="form-control"
              id="password"
              name="password"
              value={values.password!}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button
              type="submit"
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