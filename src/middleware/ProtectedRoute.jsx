// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/student/Loading"; // Import your loading spinner component

// const Loader = () => (
//     <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
//         <div className="loader"></div>
//     </div>
// );

const ProtectedRouteStudent = ({ children, allowedRole }) => {
    const { isAuth, role, loading } = useAuth();

    if (loading) {
        return <Loader />; // Show spinner while checking auth
    }

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRouteStudent;
