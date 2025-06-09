import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserService } from '../Services/UserService'; // Import your AuthService

interface AdminRouteProps {
  component: React.ComponentType<any>;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ component: Component,...rest }) => {
  return UserService.isAdmin() ? <Component {...rest} /> :  <Navigate to="/" replace />;
};

export default AdminRoute;
