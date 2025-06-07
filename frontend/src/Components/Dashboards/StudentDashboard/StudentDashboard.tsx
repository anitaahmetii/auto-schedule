import React, { useEffect, useState } from 'react';
import { Menu, Icon, Header } from 'semantic-ui-react';
import { useNavigate, Outlet } from 'react-router-dom';
import { StudentProfileService } from '../../../Services/StudentProfileService';
import { UserService } from '../../../Services/UserService';

export default function StudentDashboard() 
{
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const sidebarWidth = 180;
  const menuItemsStyle = { color: 'black', borderBottom: '1px solid olive'};

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole)
    {
        setUserRole(storedRole);
    }
  }, []);
  useEffect(() => {
    if (userRole !== "Student") return ;
    const fetchUser = async () => {
      const response = await StudentProfileService.getStudentProfileAsync();
      setUser(response.userName + " " + response.lastName);
    };
    fetchUser();
  }, [userRole]);
  const handleLogout = () => {
    UserService.LogOut();
    navigate('../login');
  }
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Menu vertical inverted
        style={{ width: `${sidebarWidth}px`, paddingTop: '2rem', height: '100vh', background: 'white', flexShrink: 0,
              border: '1px solid olive', }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',gap: 0, padding: 0 }}>
          <Header as="h2" inverted textAlign="center" style={{ color: 'olive', margin: 0 }}>
            Auto Schedule 
          </Header>
          <Header as="h5" inverted textAlign="center" style={{ color: 'black', margin: 7 }}>
            {user}
          </Header>
        </div>
        <div style={{marginTop: '20%'}}>
          <Menu.Item onClick={() => navigate('/student/profile')} style={menuItemsStyle}>
            <Icon name="user circle" />
            <strong>Profile</strong>
          </Menu.Item>
          <Menu.Item onClick={() => navigate('/student/dailyschedule')} style={menuItemsStyle}>
            <Icon name="calendar alternate" />
            <strong>Daily Schedule</strong>
          </Menu.Item>
          <Menu.Item onClick={() => navigate('/student/group')} style={menuItemsStyle}>
            <Icon name="users" />
            <strong>Group</strong>
          </Menu.Item>
          <Menu.Item onClick={() => navigate('/student/myschedule')} style={menuItemsStyle}>
            <Icon name="ellipsis vertical" />
            <strong>My Schedule</strong>
          </Menu.Item>
          <Menu.Item onClick={() => navigate('/student/attendances')} style={menuItemsStyle}>
            <Icon name="bookmark outline" />
            <strong>My Attendances</strong>
          </Menu.Item>
          <Menu.Item onClick={() => navigate('/student/njoftimet')} style={menuItemsStyle}>
            <Icon name="bell" />
            <strong>Notification</strong>
          </Menu.Item>
          <Menu.Item onClick={handleLogout} style={{color: 'black',  marginBottom: '0.9rem'}}>
            <Icon name="sign-out" />
            <strong>Logout</strong>
          </Menu.Item>
        </div>
      </Menu>
      <div style={{ flex: 1, padding: '2rem', background: 'white',  overflowY: "auto"}}>
        <Outlet />
      </div>
    </div>
  );
}
