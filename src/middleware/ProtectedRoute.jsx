// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/student/Loading";

const ProtectedRoute = ({ children, allowedRole }) => {
    const { isAuth, role, loading } = useAuth();
    if (loading) return <Loader />;

    if (!isAuth) {
        return <Navigate to="/" replace />;
    }

    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
