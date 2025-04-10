import React, { lazy, Suspense, useState } from 'react';
import { Route, Routes, useMatch } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
// import './App.css'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Getstarted'

// import Home from './pages/student/Home'
// import ExamPrep from './pages/student/ExamPrep'
import Contributors from './pages/student/Contributors'
import AboutUs from './pages/student/AboutUs'
import Syllabus from './pages/student/Syllabus'
import PYQs from './pages/student/PYQs'
import FAQs from './pages/student/FAQs'
// import Resources from './pages/student/Resourses'
import CoursesList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Notes from './pages/student/Notes'

import Admin from './pages/admin/Admin'
import Dashboard from './pages/admin/Dashboard'
import StudentsEnrolled from './pages/admin/StudentsEnrolled'
import MyContributors from './components/admin/MyContributors'
import MyCourses from './components/admin/MyCourses'
import MySyllabus from './components/admin/MySyllabus'
import MyPYQs from './components/admin/MyPYQs'
import MyFAQs from './components/admin/MyFAQs'
import MyNotes from './components/admin/MyNotes'
import AddContributors from './components/admin/AddContributors'
import AddCourse from './components/admin/AddCourse'
import AddSyllabus from './components/admin/AddSyllabus'
import AddPYQs from './components/admin/AddPYQs'
import AddFAQs from './components/admin/AddFAQs'
import AddNotes from './components/admin/AddNotes'
import Loader from './components/student/Loading'

import { useAuth } from "./context/AuthContext";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./middleware/ProtectedRoute";
import ProtectedRouteStudent from "./middleware/ProtectedRouteStudent";
import AccessForbidden from './components/student/AcessForbidden';




const Home = lazy(() => import('./pages/student/Home'));
const ExamPrep = lazy(() => import('./pages/student/ExamPrep'));
const Resources = lazy(() => import('./pages/student/Resourses'));


// Wrapper for role-based access
// const StudentRoute = ({ element, children }) => {

//   const { user } = useAuth();
//   if (!user || user.role !== 'student') return <Navigate to="/" replace />;
//   return element || children;
// };
// const AdminRoute = ({ element }) => {
//   const { user } = useAuth();
//   return user && user.role === 'admin' ? element : <Navigate to="/" replace />;
// };



function App() {
  const isAdminRoute = useMatch('/ghost/*')

  return (
    <Suspense fallback={<Loader />}>
      <AuthProvider>
        <div className='text-default min-h-screen bg-auto'>
          {/* {!isAdminRoute && <NavBar/>} */}

          <Routes>

            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/contributors' element={<Contributors />} />
        <Route path = '/about-us' element = {<AboutUs />} />
            <Route
              path="/Home"
              element={
                <ProtectedRouteStudent allowedRole="student">
                  <Home />
                </ProtectedRouteStudent>
              }
            />

            <Route
              path="/exam-prep"
              element={
                <ProtectedRouteStudent allowedRole="student">
                  <ExamPrep />
                </ProtectedRouteStudent>
              }
            >
              <Route path="syllabus" element={<Syllabus />} />
              <Route path="pyqs" element={<PYQs />} />
              <Route path="faqs" element={<FAQs />} />
            </Route>

            <Route
              path="/resources"
              element={
                <ProtectedRouteStudent allowedRole="student">
                  <Resources />
                </ProtectedRouteStudent>
              }
            >
              <Route path="course-list" element={<CoursesList />} />
              <Route path="course-list/:input" element={<CoursesList />} />
              <Route path="course/:id" element={<CourseDetails />} />
              <Route path="my-enrollments" element={<MyEnrollments />} />
              <Route path="player/:courseId" element={<Player />} />
              <Route path="loading/:path" element={<Loading />} />
              <Route path="notes" element={<Notes />} />
              <Route path="unauthorized" element={<AccessForbidden/>} />
            </Route>


            <Route
              path="/ghost"
              element={
                <ProtectedRoute allowedRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path='students-enrolled' element={<StudentsEnrolled />} />
              <Route path='my-contributors' element={<MyContributors />} />
              <Route path='my-courses' element={<MyCourses />} />
              <Route path='my-syllabus' element={<MySyllabus />} />
              <Route path='my-pyqs' element={<MyPYQs />} />
              <Route path='my-faqs' element={<MyFAQs />} />
              <Route path='my-notes' element={<MyNotes />} />
              <Route path='add-contributors' element={<AddContributors />} />
              <Route path='add-course' element={<AddCourse />} />
              <Route path='add-syllabus' element={<AddSyllabus />} />
              <Route path='add-pyqs' element={<AddPYQs />} />
              <Route path='add-faqs' element={<AddFAQs />} />
              <Route path='add-notes' element={<AddNotes />} />
              <Route path='unauthorized' element={<AccessForbidden/>} />
            </Route>
            <Route path='unauthorized' element={<AccessForbidden/>} />


          </Routes>


        </div>
      </AuthProvider >
    </Suspense >
  )
}

export default App
