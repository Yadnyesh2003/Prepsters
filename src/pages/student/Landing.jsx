import React, { useState, useEffect } from 'react'
import Navbar from '../../components/student/NavBar'
import Hero from '../../components/student/Hero'
import Features from '../../components/student/Features'
import HowItWorks from '../../components/student/HowItWorks'
import ImpactSection from '../../components/student/Impacts'
import Footer from '../../components/student/Footer'
import Loader from '../../components/student/Loading'
import { useTheme } from '../../context/ThemeContext'


function Landing() {

    const { loading } = useTheme();

    if (loading) {
        return (
            <Loader />
        );
    }
    return (
        <div><Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <ImpactSection />
            <Footer />
        </div>

    )
}

export default Landing