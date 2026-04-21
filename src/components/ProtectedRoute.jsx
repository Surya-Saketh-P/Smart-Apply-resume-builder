import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (<div className="flex h-screen w-full items-center justify-center bg-[#FAF9F6]">
        <div className="h-8 w-8 animate-spin rounded-none border-2 border-black border-t-transparent"></div>
      </div>);
    }
    if (!user) {
        return <Navigate to="/login" replace/>;
    }
    return <>{children}</>;
};
export default ProtectedRoute;
