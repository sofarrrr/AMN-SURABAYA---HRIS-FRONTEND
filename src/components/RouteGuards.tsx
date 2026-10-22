import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Perizinan from '../pages/Perizinan';

export function DirekturOnly() {
  const { user } = useAuth();
  return user?.role === 'Direktur'
    ? <Outlet />
    : <Navigate to={`/${user?.role?.toLowerCase() || ''}/dashboard`} replace />;
}

export function ReviewerOnly() {
  const { user } = useAuth();
  return user && user.role !== 'Karyawan'
    ? <Perizinan />
    : <Navigate to={`/${user?.role?.toLowerCase() || ''}/dashboard`} replace />;
}
