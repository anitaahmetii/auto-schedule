import React, { useEffect, useState } from "react";
import { Card, List, ListHeader, ListItem } from "semantic-ui-react";
import { StudentProfileModel } from "../../../Interfaces/StudentProfileModel";
import { StudentProfileService } from "../../../Services/StudentProfileService";
import { SelectListItem } from "../../../Interfaces/SelectListItem";
import { CityService } from "../../../Services/CityService";
import { DepartmentService } from "../../../Services/DepartmentService";

export default function StudentProfileTable() 
{
    const [userRole, setUserRole] = useState<string | null>(null);
    const [student, setStudent] = useState<StudentProfileModel>();
    const mapTo = (data: any[]): SelectListItem[] => data.map((item, i) => ({key: i, value: item.id, text: item.name}))
    const [city, setCity] = useState<SelectListItem[]>([]); 
    const [department, setDepartment] = useState<SelectListItem[]>([]); 

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole)
        {
            setUserRole(storedRole);
        }
    }, []);
    useEffect(() => {
        if (userRole !== "Student") return;
        const fetchData = async () => {
            const result = await StudentProfileService.getStudentProfileAsync();
            setStudent(result);
        };
        fetchData();
    }, [userRole]);
    useEffect(() => {
        let cancelled = false; 
        const fetchData = async () => {
            try 
            {
                const [cityR, departmentR] = await Promise.all([CityService.GetSelectList(), DepartmentService.GetSelectList()]);
                if (!cancelled)
                {
                    setCity(mapTo(cityR));
                    setDepartment(mapTo(departmentR));
                }
            }
            catch (err) 
            {
                console.error("Error loading the lists!", err);
            }
        };
        fetchData();
        return () => 
        {
            cancelled = true;                  
        };
    }, []);

  return (
    <div style={{ display: "flex", width: '670px', height: "88vh",  marginLeft: '0%', marginTop: '-1%',  }}>
        <Card raised style={{ width: "90vw", maxWidth: "680px", maxHeight: "95vh", display: "flex", flexDirection: "column", }}>
            {/* {student.map(s => ())} */}
            <Card.Content style={{ backgroundColor: "#556B2F", color: "white", padding: "1.5em", borderTopLeftRadius: "1px",
                                borderTopRightRadius: "0.28571429rem", flexShrink: 0, }}>
                <Card.Header style={{ fontSize: "1.8rem", marginBottom: "0.3em", color: "white" }}>
                    {student?.userName} {student?.lastName}
                </Card.Header>
                <Card.Meta style={{ color: "white"}}>
                    {department.find(d => d.value === student?.departmentId)?.text} - {student?.academicProgram} [{student?.academicYear}]
                </Card.Meta>
            </Card.Content>
            <Card.Content style={{ overflowY: "auto", paddingTop: "1em", }}>
            <List divided relaxed>
                <ListItem>
                    <ListHeader>Student ID</ListHeader>
                        {student?.id}
                </ListItem>
                <ListItem>
                    <ListHeader>Personal ID</ListHeader>
                        {student?.personalID}
                </ListItem>
                <ListItem>
                    <ListHeader>Email</ListHeader>
                        {student?.email}
                </ListItem>
                <ListItem>
                    <ListHeader>Personal Email</ListHeader>
                        {student?.personalEmail}
                </ListItem>
                <ListItem>
                    <ListHeader>Birthdate</ListHeader>
                    {student?.birthdate}
                </ListItem>
                <ListItem>
                    <ListHeader>Birthplace</ListHeader>
                    {city.find(c => c.value === student?.cityId)?.text}
                </ListItem>
                <ListItem>
                    <ListHeader>Address</ListHeader>
                    {student?.address}
                </ListItem>
                <ListItem>
                    <ListHeader>Gender</ListHeader>
                    {student?.gender}
                </ListItem>
                <ListItem>
                    <ListHeader>Phone Number</ListHeader>
                    {student?.phoneNumber}
                </ListItem>
                <ListItem>
                    <ListHeader>Registred</ListHeader>
                    {student?.registred}
                </ListItem>
            </List>
        </Card.Content>
      </Card>
    </div>
  );
}
