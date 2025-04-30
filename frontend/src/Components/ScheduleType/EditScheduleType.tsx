import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ScheduleTypeModel } from "../../Interfaces/ScheduleTypeModel";

// Definimi i ScheduleTypes si një enum
const ScheduleTypes = {
  Morning: 1,
  Afternoon: 2,
  Hybrid: 3,
};

// Funksion për me kthy prej numrit në emër
const getScheduleTypeName = (number: number) => {
  const entry = Object.entries(ScheduleTypes).find(([key, value]) => value === number);
  return entry ? entry[0] : "Unknown";
};

export default function EditScheduleType() {
  const { id } = useParams<{ id: string }>(); // Merr 'id' nga URL
  const navigate = useNavigate(); // Për drejtuar pas dorëzimit të formularit

  // Inicializo shtetit për ScheduleType
  const [scheduleType, setScheduleType] = useState<ScheduleTypeModel>({
    id: id!,
    scheduleTypes: null, // Po e mbajmë bosh për inicializim
    userId: '', // Po e mbajmë bosh për inicializim, mund të vendoset më vonë
  });
  const [error, setError] = useState<string>("");

  // Merr të dhënat e ScheduleType nëse është për editim
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`https://localhost:7085/api/ScheduleType/${id}`);
          const data = response.data;
          setScheduleType({
            id: data.id,
            scheduleTypes: data.scheduleTypes, // Këtu mund të jetë vlera numerike
            userId: data.userId, // Sigurohuni që userId është i vlefshëm
          });
        } catch (error) {
          console.error("Gabim gjatë marrjes së detajeve të ScheduleType:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  // Funksioni për përditësimin e inputeve
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScheduleType({ ...scheduleType, [name]: value });
  };

  // Funksioni për përditësimin e dropdown për ScheduleTypes
  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Këtu përdorim vlerën numerike të enum-it ScheduleTypes
    setScheduleType({
      ...scheduleType,
      [name]: value === "" ? null : Number(value),
    });
  };

  // Funksioni i submit-it për dërgimin e të dhënave në backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verifikimi që userId ka rol 0 (administrator)
    try {
      const response = await axios.get(`https://localhost:7085/api/User/${scheduleType.userId}`);
      const user = response.data;

      if (user.role !== 0) {
        setError("Only users with role 0 (Administrator) can be assigned to Schedule Type.");
        return; // Nuk e lejojmë dërgimin
      }

      const model = {
        id: scheduleType.id,
        scheduleTypes: scheduleType.scheduleTypes,
        userId: scheduleType.userId,
      };

      console.log("Dërgimi i modelit në backend:", model);  // Konsollë për të parë të dhënat që po dërgohen

      const submitResponse = await axios.post("https://localhost:7085/api/ScheduleType", model);
      console.log("Përditësimi i ScheduleType u bë me sukses", submitResponse.data);
      navigate("/scheduleType");
    } catch (error) {
      console.error("Gabim gjatë ruajtjes së ScheduleType:", error);
    }
  };

  return (
    <>
      <h1 style={{ marginLeft: "15px", fontFamily: "Georgia", color: "black" }}>
        {scheduleType.id != null ? "Edit" : "Add"} Schedule Type
      </h1>
      <p style={{ marginLeft: "15px", color: "#555", fontSize: "14px" }}>
        Please fill out the form below to {scheduleType.id != null ? "edit" : "create"} a Schedule Type.
      </p>

      {error && (
        <div style={{ color: "red", marginLeft: "15px" }}>
          <p>{error}</p>
        </div>
      )}

      <div
        style={{
          margin: "30px 30px 0 10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgb(15 179 126 / 87%)",
        }}
      >
        <form
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
          }}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              Choose Schedule Type
            </label>
            <select
              name="scheduleTypes"
              value={scheduleType.scheduleTypes || ""}
              onChange={handleChangeSelect}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                marginBottom: "15px",
              }}
            >
              <option value="" disabled>
                Select a schedule type
              </option>
              {Object.entries(ScheduleTypes).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              Administrator ID
            </label>
            <input
              type="text"
              name="userId"
              value={scheduleType.userId}
              onChange={handleChange}
              placeholder="Administrator ID"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                marginBottom: "15px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/scheduleType")}
              style={{
                backgroundColor: "#f0f0f0",
                color: "#333",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: "#32a852",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {scheduleType.id ? "Update" : "Add"} Schedule Type
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
