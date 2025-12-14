import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { UserRole } from '../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user has permission
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.tipo)) {
      // User doesn't have permission - redirect to dashboard
      return <Navigate to="/dashboard" replace state={{ from: location }} />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;
