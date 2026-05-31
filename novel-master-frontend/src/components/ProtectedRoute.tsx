import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
interface ProtectedRouteProps { children: ReactNode; }
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('nm_token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
