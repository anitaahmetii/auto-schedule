import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { CityModel } from '../../Interfaces/CityModel';
import { CityService } from '../../Services/CityService';
import { SelectListItem } from '../../Interfaces/SelectListItem';
import { StateService } from '../../Services/StateService';

export default function EditCity() {
  const { id } = useParams<{ id: string}>();
  const [stateList, setStateList] = useState<SelectListItem[]>([]);
  const [values, setValues] = useState<CityModel>({
    id:id!,
    name: '',
    stateId: '',
  } as CityModel);

  const navigate = useNavigate();
  const [city, setcity] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if(id!=null){
     const response = await CityService.GetCityDetails(id!);
     const userData = response;
     setValues({
       id: userData.id,
       name: userData.name,
       stateId: userData.stateId,
     }as CityModel);
    }
  };
  
  fetchData();

}, [id!]);

const fetchStateList = async () => {
  const response = await StateService.GetSelectList();

  setStateList(response.map((item,i)=>({
    key: i,
    value: item.id,
    text: item.name
  } as SelectListItem)).filter(x=>x.text != '' &&x.text != null));


}
useEffect(() => {
  fetchStateList();
}, []);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    let model = {
      id: values.id!,
      name: values.name,
      stateId:values.stateId,
    } as CityModel;

    const response = await axios.post(
      "https://localhost:7085/api/City",
      model
    );
    setcity(true);
    sendToOverview();
  } catch (error) {
    console.error("Error creating city:", error);
  }
};
function sendToOverview(){
  navigate('/city');
 }
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target;
  setValues({ ...values, [name]: value });
};
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  setValues({ ...values, [name]: value });
};
  return (
    <>  
    <h1 style={{ marginLeft: "15px", fontFamily: "Georgia", color: "black" }}>
        {values.id != null ? 'Edit' : 'Add'} City
      </h1>
      <p style={{ marginLeft: "15px", color: "#555", fontSize: "14px" }}>
        Please fill out the form below to {values.id != null ? 'edit' : 'create'} a City.
      </p>
      <Segment clearing style={{ margin: "30px 30px 0 10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", border: "1px solid rgb(15 179 126 / 87%)" }}>
    <form className='ui form' style={{ backgroundColor: "#f9f9f9", padding: "20px" }} onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
        <label>Name</label>
          <input
            style={{ padding: "5px", margin: "5px" }}
            type="text"
            placeholder=" Name"
            className="form-control"
            id="name"
            name="name"
            value={values.name!}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6-w-100%">
              <select className="form-control"
                name="stateId" 
                id="stateId"
                value= {values.stateId || ""}
                onChange={handleSelectChange}
                style={{ marginBottom: "15px"}}
                >
                  <option value="" disabled>Select State</option>
                  {stateList.map((x) => (
                    <option key={x.key} value={x.value!}>{x.text}</option>
                  ))}
                </select>
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
      <br/>
      <br/>
    </>
  );
}
