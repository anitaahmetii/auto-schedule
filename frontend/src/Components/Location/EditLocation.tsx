import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { LocationModel } from '../../Interfaces/LocationModel';
import { LocationService } from '../../Services/LocationService';

export default function EditLocation(){
    const {id}=useParams<{id:string}>();
    const[values,setValues]=useState<LocationModel>({
        id:id!,
        name:'',
        city:'',
        streetNo:'',
        zipCode:'',
        phoneNumber:'',
    }as LocationModel);

    const navigate = useNavigate();
    const[location, setlocation]=useState(false);
    useEffect(()=>{
        const fetchData = async()=>{
            if(id!=null){
                const response = await LocationService.GetLocationDetails(id!);
                const userData=response;
                setValues({
                    id: userData.id,
                    name: userData.name,
                    city: userData.city,
                    streetNo: userData.streetNo,
                    zipCode: userData.streetNo,
                    phoneNumber: userData.phoneNumber,
                }as LocationModel);
            }

        };

        fetchData();
    }, [id!]);

    const handleSubmit=async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            let model={
                id: values.id!,
                name:values.name,
                city:values.city,
                streetNo:values.streetNo,
                zipCode:values.zipCode,
                phoneNumber:values.phoneNumber,
            } as LocationModel;

            const response = await axios.post(
                "https://localhost:7085/api/Location",
                model
              );
              setlocation(true);
              sendToOverview();
        }catch(error){
            console.error("Error creating location: ",error);
        }
    };

    function sendToOverview(){
        navigate('/Location');
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    return (
        <>
        <h1 style={{ marginLeft: "15px", fontFamily: "Georgia", color: "black" }}>
                {values.id != null ? 'Edit' : 'Add'} Location
              </h1>
              <p style={{ marginLeft: "15px", color: "#555", fontSize: "14px" }}>
                Please fill out the form below to {values.id != null ? 'edit' : 'create'} a Location.
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
                 <label>City</label>
            <input
              style={{ padding: '5px', margin: '5px' }}
              type="text"
              placeholder="City"
              className="form-control"
              name="city"
              value={values.city!}
              onChange={handleChange}
            />
            <label>StreetNo</label>
            <input
              style={{ padding: '5px', margin: '5px' }}
              type="text"
              placeholder="Street No"
              className="form-control"
              name="streetNo"
              value={values.streetNo!}
              onChange={handleChange}
            />
            <label>ZipCode</label>
            <input
              style={{ padding: '5px', margin: '5px' }}
              type="text"
              placeholder="Zip Code"
              className="form-control"
              name="zipCode"
              value={values.zipCode!}
              onChange={handleChange}
            />
            <label>PhoneNumber</label>
            <input
              style={{ padding: '5px', margin: '5px' }}
              type="text"
              placeholder="Phone Number"
              className="form-control"
              name="phoneNumber"
              value={values.phoneNumber!}
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
            <br/>
            <br/>
        </>
    );

}