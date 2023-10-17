import React,{useEffect, useContext} from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthProvider';


const RequireAuth = () => {
  const {store} = useContext(AuthContext)
  const token = localStorage.getItem('token');
  const location = useLocation()
  useEffect(() => {
    if (localStorage.getItem('token')) {
        store?.checkAuth()
    }
}, [])
  return (
      token
          ? <Outlet />
          : <Navigate to="/login" state={{ from: location }} replace />
  )
}
export default RequireAuth