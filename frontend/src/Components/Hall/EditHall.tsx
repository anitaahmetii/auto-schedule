import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import { LocationService } from '../../Services/LocationService';
import { HallModel } from '../../Interfaces/HallModel';
import { HallService } from '../../Services/HallService';
import { SelectListItem } from '../../Interfaces/SelectListItem';

export default function EditHall(){
    const {id} = useParams<{id: string}>();
    //const [hallList, setHallList] = useState<SelectListItem[]>([]);
    const [stateList, setStateList] = useState<SelectListItem[]>([]);
    const [values, setValues] = useState<HallModel>({
        id: id!,
        name: '',
        capacity: null,
        // userId:'',
        locationId:'',
    } as HallModel);

    const navigate = useNavigate();
    const [hall, setHall] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (id != null) {
                const response = await HallService.GetHallDetails(id!);
                const userData = response;
                setValues({
                    id: userData.id,
                    name: userData.name,
                    capacity: userData.capacity,
                    // userId: userData.userId,
                    locationId: userData.locationId,
                } as HallModel);
            }
        };

        fetchData();
    }, [id!]);

    const fetchLocationList = async () => {
        const response = await LocationService.GetSelectList();
        setStateList(response.map((item, i) => ({
                    key: i,
                    value: item.id,
                    text: item.name
                } as SelectListItem)).filter(x => x.text !== '' && x.text !== null)
        );
    };
    
    useEffect(()=>{
        fetchLocationList();
    }, []);
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let model = {
                id: values.id!,
                name: values.name,
                capacity: values.capacity,
                // userId:values.userId,
                locationId:values.locationId,
            } as HallModel;

            const response = await axios.post(
                "https://localhost:7085/api/Hall",
                model
            );
            setHall(true);
            sendToOverview();
        } catch (error) {
            console.error("Error creating hall: ", error);
        }
    };

    function sendToOverview(){
        navigate('/hall');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({ ...values, [name] : value });
    };
   const handleSelectChange=(e: React.ChangeEvent<HTMLSelectElement>) =>{
        const { name, value } = e.target;
        setValues({ ...values, [name] : value });
    }

    return (
        <>
        <h1 style={{ marginLeft: "15px", fontFamily: "Georgia", color: "black" }}>
            {values.id != null ? 'Edit' : 'Add'} Hall
        </h1>
        <p style={{ marginLeft: "15px", color: "#555", fontSize: "14px" }}>
            Please fill out the form below to {values.id != null ? 'edit' : 'create'} a Hall.
        </p>
        <Segment clearing style={{ margin: "30px 30px 0 10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", border: "1px solid rgb(15 179 126 / 87%)" }}>
            <form className='ui form' style={{ backgroundColor: "#f9f9f9", padding: "20px" }} onSubmit={handleSubmit} autoComplete="off">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        style={{ padding: "5px", margin: "5px" }}
                        type="text"
                        placeholder="Name"
                        className="form-control"
                        name="name"
                        value={values.name || ''}
                        onChange={handleChange}
                    />
                    <label>Capacity</label>
                    <input
                        style={{ padding: "5px", margin: "5px" }}
                        type="number"
                        placeholder="Capacity"
                        className="form-control"
                        name="capacity"
                        value={values.capacity || ''}
                        onChange={handleChange}
                    />

                    <label>Location</label>
                        <select  className="form-control"
                        name="locationId"
                        id="locationId"
                        value={values.locationId || ''}
                        onChange={handleSelectChange}
                        style={{ marginBottom: "15px"}}
                        >
                            <option value='' disabled>Select Location</option>
                            {stateList.map((x)=>(
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
