import React, { useEffect, useState } from "react";
import { Card, List, ListHeader, ListItem } from "semantic-ui-react";
import { LecturerProfileModel } from "./../../Interfaces/LecturerProfileModel";
import { LecturerProfileService } from "./../../Services/LecturerProfileService";
import { SelectListItem } from "./../../Interfaces/SelectListItem";
import { CityService } from "./../../Services/CityService";

export default function LecturerProfileTable() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [lecturer, setLecturer] = useState<LecturerProfileModel>();
  const [city, setCity] = useState<SelectListItem[]>([]);

  // Mapper funksion për listat dropdown
  const mapTo = (data: any[]): SelectListItem[] =>
    data.map((item, i) => ({ key: i, value: item.id, text: item.name }));

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  useEffect(() => {
    if (userRole !== "Lecture") return;
    const fetchData = async () => {
      const result = await LecturerProfileService.getLecturerProfileAsync();
      setLecturer(result);
    };
    fetchData();
  }, [userRole]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const cityResult = await CityService.GetSelectList();
        if (!cancelled) {
          setCity(mapTo(cityResult));
        }
      } catch (err) {
        console.error("Error loading the city list!", err);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "670px",
        height: "88vh",
        marginLeft: "0%",
        marginTop: "-1%",
      }}
    >
      <Card
        raised
        style={{
          width: "90vw",
          maxWidth: "680px",
          maxHeight: "95vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card.Content
          style={{
            backgroundColor: "#556B2F",
            color: "white",
            padding: "1.5em",
            borderTopLeftRadius: "1px",
            borderTopRightRadius: "0.28571429rem",
            flexShrink: 0,
          }}
        >
          <Card.Header
            style={{ fontSize: "1.8rem", marginBottom: "0.3em", color: "white" }}
          >
            {lecturer?.userName} {lecturer?.lastName}
          </Card.Header>
          <Card.Meta style={{ color: "white" }}>
            {lecturer?.academicGrade}
          </Card.Meta>
        </Card.Content>

        <Card.Content style={{ overflowY: "auto", paddingTop: "1em" }}>
          <List divided relaxed>
            <ListItem>
              <ListHeader>Lecturer ID</ListHeader>
              {lecturer?.id}
            </ListItem>
            <ListItem>
              <ListHeader>Personal ID</ListHeader>
              {lecturer?.personalID}
            </ListItem>
            <ListItem>
              <ListHeader>Email</ListHeader>
              {lecturer?.email}
            </ListItem>
            <ListItem>
              <ListHeader>Personal Email</ListHeader>
              {lecturer?.personalEmail}
            </ListItem>
            <ListItem>
              <ListHeader>Birthdate</ListHeader>
              {lecturer?.birthdate}
            </ListItem>
            <ListItem>
              <ListHeader>City</ListHeader>
              {city.find((c) => c.value === lecturer?.cityId)?.text}
            </ListItem>
            <ListItem>
              <ListHeader>Address</ListHeader>
              {lecturer?.address}
            </ListItem>
            <ListItem>
              <ListHeader>Gender</ListHeader>
              {lecturer?.gender}
            </ListItem>
            <ListItem>
              <ListHeader>Phone Number</ListHeader>
              {lecturer?.phoneNumber}
            </ListItem>
          </List>
        </Card.Content>
      </Card>
    </div>
  );
}