import React, { lazy, Suspense, useState } from 'react';
import { Route, Routes, useMatch,Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';


import Landing from './pages/student/Landing'


import Contributors from './pages/student/Contributors'
import AboutUs from './pages/student/AboutUs'
import Syllabus from './pages/student/Syllabus'
import PYQs from './pages/student/PYQs'
import FAQs from './pages/student/FAQs'
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

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./middleware/ProtectedRoute";
import AccessForbidden from './components/student/AccessForbidden';
import Navbar from './components/student/NavBar';
import Profile from './pages/student/Profile';
import Bookmarks from './pages/student/Bookmarks';
import CreateInterview from './pages/student/CreateInterview';
import ScheduledInterviews from './pages/student/ScheduledInterviews';
import InterviewSession from './pages/student/InterviewSession';
import Feedback from './pages/student/Feedback';





const ExamPrep = lazy(() => import('./pages/student/ExamPrep'));
const Resources = lazy(() => import('./pages/student/Resourses'));
const Interviews = lazy(() => import('./pages/student/Interviews'))


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
  const isAdminRoute = useMatch('/ghost/*');
  const isUnauthorizedRoute = useMatch('/unauthorized');

  return (

    <Suspense fallback={<Loader />}>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <AuthProvider>
        <div className='text-default min-h-screen bg-auto'>
          {!isAdminRoute && !isUnauthorizedRoute && <Navbar />}

          <Routes>

            <Route path='/' element={<Landing />} />
            <Route path='/contributors' element={<Contributors />} />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path="*" element={<Navigate to="/unauthorized" replace />} />

            


            <Route
              path='/profile' element={
                <ProtectedRoute allowedRole="student">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/bookmarks' element={
                <ProtectedRoute allowedRole="student">
                  <Bookmarks />
                </ProtectedRoute>
              }
            />




            <Route
              path="/exam-prep"
              element={
                <ProtectedRoute allowedRole="student">
                  <ExamPrep />
                </ProtectedRoute>
              }
            >
              <Route path="syllabus" element={<Syllabus />} />
              <Route path="pyqs" element={<PYQs />} />
              <Route path="faqs" element={<FAQs />} />
            </Route>


            <Route
              path="/resources"
              element={
                <ProtectedRoute allowedRole="student">
                  <Resources />
                </ProtectedRoute>
              }
            >
              <Route path="course-list" element={<CoursesList />} />
              <Route path="course-list/:input" element={<CoursesList />} />
              <Route path="course/:id" element={<CourseDetails />} />
              <Route path="my-enrollments" element={<MyEnrollments />} />
              <Route path="player/:courseId" element={<Player />} />
              <Route path="loading/:path" element={<Loading />} />
              <Route path="notes" element={<Notes />} />
              <Route path="unauthorized" element={<AccessForbidden />} />
            </Route>

            <Route
              path="/interview"
              element={
                <ProtectedRoute allowedRole="student">
                  <Interviews />
                </ProtectedRoute>
              }
            >
              <Route path="create" element={<CreateInterview />} />
              <Route path="list" element={<ScheduledInterviews />} />
              <Route path=":id" element={<InterviewSession />} />
              <Route path=":id/feedback" element={<Feedback/>} />
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
            </Route>
            <Route path='unauthorized' element={<AccessForbidden />} />
          </Routes>

        </div>
      </AuthProvider >
    </Suspense >
  )
}

export default App
