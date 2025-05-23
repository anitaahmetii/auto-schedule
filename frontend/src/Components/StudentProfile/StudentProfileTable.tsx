import React from "react";
import { Card, List, ListHeader, ListItem } from "semantic-ui-react";

export default function StudentProfileTable() {
  const student = {
    id: "11111111111111111",
    personId: "22222222222222",
    firstName: "Filan",
    lastName: "Fisteku",
    birthDate: "14.10.2001",
    gender: "F",
    phoneNumber: "044-444-444",
    department: "Computer Science",
    academicProgram: "Bachelor",
    email: "student@ok.com",
    personalEmail: "personal@email.com",
    birthplace: "Kosove, Prishtine",
    academicYear: "2022/2023",
    registred: "22.05.2025",
    address: "Dardania",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px", height: "100vh", }}>
        <Card raised style={{ width: "90vw", maxWidth: "700px", maxHeight: "90vh", display: "flex", flexDirection: "column",}}>
            <Card.Content style={{ backgroundColor: "#1b2a4e", color: "white", padding: "1.5em", borderTopLeftRadius: "1px",
                                borderTopRightRadius: "0.28571429rem", flexShrink: 0, }}>
                <Card.Header style={{ fontSize: "1.8rem", marginBottom: "0.3em", color: "white" }}>
                    {student.firstName} {student.lastName}
                </Card.Header>
                <Card.Meta style={{ color: "white"}}>
                    {student.department} - {student.academicProgram} [{student.academicYear}]
                </Card.Meta>
            </Card.Content>
            <Card.Content style={{ overflowY: "auto", paddingTop: "1em", }}>
            <List divided relaxed>
                <ListItem>
                    <ListHeader>Student ID</ListHeader>
                        {student.id}
                </ListItem>
                <ListItem>
                    <ListHeader>Personal ID</ListHeader>
                        {student.personId}
                </ListItem>
                <ListItem>
                    <ListHeader>Email</ListHeader>
                        {student.email}
                </ListItem>
                <ListItem>
                    <ListHeader>Personal Email</ListHeader>
                        {student.personalEmail}
                </ListItem>
                <ListItem>
                    <ListHeader>Birthdate</ListHeader>
                    {student.birthDate}
                </ListItem>
                <ListItem>
                    <ListHeader>Birthplace</ListHeader>
                    {student.birthplace}
                </ListItem>
                <ListItem>
                    <ListHeader>Address</ListHeader>
                    {student.address}
                </ListItem>
                <ListItem>
                    <ListHeader>Gender</ListHeader>
                    {student.gender}
                </ListItem>
                <ListItem>
                    <ListHeader>Phone Number</ListHeader>
                    {student.phoneNumber}
                </ListItem>
                <ListItem>
                    <ListHeader>Registred</ListHeader>
                    {student.registred}
                </ListItem>
            </List>
        </Card.Content>
      </Card>
    </div>
  );
}
