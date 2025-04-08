import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import { useAuth } from './context/AuthContext';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const ExamPrep = lazy(() => import('./pages/ExamPrep'));
const Resources = lazy(() => import('./pages/Resources'));

// Wrapper for role-based access
const StudentRoute = ({ element }) => {
    const { user } = useAuth();
    return user && user.role === 'student' ? element : <Navigate to="/" replace />;
};
const AdminRoute = ({ element }) => {
    const { user } = useAuth();
    return user && user.role === 'admin' ? element : <Navigate to="/" replace />;
}; 