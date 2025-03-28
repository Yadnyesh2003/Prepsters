import { useState } from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import './App.css'
import NavBar from './components/student/NavBar'
import Home from './pages/student/Home'
import ExamPrep from './pages/student/ExamPrep'
import Contributors from './pages/student/Contributors'
import Syllabus from './pages/student/Syllabus'
import PYQs from './pages/student/PYQs'
import FAQs from './pages/student/FAQs'
import Resources from './pages/student/Resourses'
import CoursesList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Notes from './pages/student/Notes'

import Admin from './pages/admin/Admin'
import Dashboard from './pages/admin/Dashboard'
import StudentsEnrolled from './pages/admin/StudentsEnrolled'
import MyContributors from './pages/admin/MyContributors'
import MyCourses from './pages/admin/MyCourses'
import MySyllabus from './pages/admin/MySyllabus'
import MyPYQs from './pages/admin/MyPYQs'
import MyFAQs from './pages/admin/MyFAQs'
import MyNotes from './pages/admin/MyNotes'
import AddContributors from './pages/admin/AddContributors'
import AddCourse from './pages/admin/AddCourse'
import AddSyllabus from './pages/admin/AddSyllabus'
import AddPYQs from './pages/admin/AddPYQs'
import AddFAQs from './pages/admin/AddFAQs'
import AddNotes from './pages/admin/AddNotes'



function App() {
  const isAdminRoute = useMatch('/ghost/*')

  return (
    <div className='text-default min-h-screen bg-auto'>
      {!isAdminRoute && <NavBar />}
      <Routes>

        <Route path = '/' element = {<Home />} />
        <Route path = '/contributors' element = {<Contributors />} />

        <Route path = '/exam-prep' element = {<ExamPrep />} >
          <Route path = 'syllabus' element = {< Syllabus/>} />
          <Route path = 'pyqs' element = {<PYQs />} />
          <Route path = 'faqs' element = {<FAQs />} />
        </Route>

        <Route path = '/resources' element = {<Resources />} >
          <Route path = 'course-list' element = {<CoursesList />} />
          <Route path = 'course-list/:input' element = {<CoursesList />} />
          <Route path = 'course/:id' element={<CourseDetails />} />
          <Route path = 'my-enrollments' element ={<MyEnrollments />} />
          <Route path = 'player/:courseId' element ={<Player />} />
          <Route path = 'loading/:path' element ={<Loading />} />
          <Route path = 'notes' element = {<Notes />} />
        </Route>

        <Route path = '/ghost' element = {<Admin />} >
          <Route path = '' element = {<Dashboard />} />
          <Route path = 'students-enrolled' element = {<StudentsEnrolled/>} />
          <Route path = 'my-contributors' element = {<MyContributors/>} />
          <Route path = 'my-courses' element = {<MyCourses/>} />
          <Route path = 'my-syllabus' element = {<MySyllabus/>} />
          <Route path = 'my-pyqs' element = {<MyPYQs/>} />
          <Route path = 'my-faqs' element = {<MyFAQs/>} />
          <Route path = 'my-notes' element = {<MyNotes/>} />

          <Route path = 'add-contributors' element = {<AddContributors/>} />
          <Route path = 'add-course' element = {<AddCourse/>} />
          <Route path = 'add-syllabus' element = {<AddSyllabus/>} />
          <Route path = 'add-pyqs' element = {<AddPYQs/>} />
          <Route path = 'add-faqs' element = {<AddFAQs/>} />
          <Route path = 'add-notes' element = {<AddNotes/>} />
        </Route>

      </Routes>

    </div>
  )
}

export default App
