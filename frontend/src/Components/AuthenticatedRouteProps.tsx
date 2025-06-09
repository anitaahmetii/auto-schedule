import React from 'react';

import { UserService } from '../Services/UserService'// Import your AuthService
import { Navigate, Outlet } from 'react-router-dom';

interface AuthenticatedRouteProps {
  component: React.ComponentType<any>;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ component: Component,...rest }) => {
  return UserService.isAuthenticated() ? <Component {...rest} /> : <Navigate to="/" replace />;
};

export default AuthenticatedRoute;
