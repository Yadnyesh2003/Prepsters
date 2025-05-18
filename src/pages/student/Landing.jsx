import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../../components/student/NavBar'
import Hero from '../../components/student/Hero'
import Features from '../../components/student/Features'
import HowItWorks from '../../components/student/HowItWorks'
import ImpactSection from '../../components/student/Impacts'
import Footer from '../../components/student/Footer'
import Loader from '../../components/student/Loading'
import { useTheme } from '../../context/ThemeContext'
import LatestContent from '../../components/student/LatestContent'
import { AppContext } from '../../context/AppContext'
import { assets, popSound } from '../../assets/assets'


function Landing() {

    const { loading } = useTheme();
    const { toast } = useContext(AppContext);

    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            setHasInteracted(true);
            window.removeEventListener('click', handleInteraction);
        };
    
        window.addEventListener('click', handleInteraction);
    
        return () => window.removeEventListener('click', handleInteraction);
    }, []);

    useEffect(() => {
        if (!hasInteracted) return;
    
        const timer = setTimeout(() => {
            const sound = popSound.cloneNode();
            sound.play().catch((e) => console.error('Sound play error:', e));
    
            toast.dismiss();
    
            toast.custom(
                (t) => (
                    <div
                        className={`${
                            t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-purple-100 shadow-lg rounded-lg pointer-events-auto flex flex-col sm:flex-row ring-1 ring-black ring-opacity-5`}
                    >
                        <div className="flex-1 w-full p-4">
                            <div className="flex items-center space-x-3 mb-2">
                                <img
                                    className="h-8 w-8 sm:h-8 sm:w-8 rounded-full"
                                    src={assets.tte_transparent_logo}
                                    alt="Warning"
                                />
                                <p className="text-sm sm:text-base font-medium text-gray-900">
                                    Please note the following points:
                                </p>
                            </div>
    
                            <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-900 space-y-2 pl-5">
                                <li>
                                    For accessing <strong>"First Year"</strong> Syllabus/ PYQs/ FAQs/ Notes, please select <strong>"General Science & Humanities"</strong> as branch. Other branches won't return First Year data.
                                </li>
                                <li>
                                    Each filter application increases API reads and affects billing 💸. Kindly avoid unnecessary filter requests 🙏.
                                </li>
                            </ol>
                        </div>
                        <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200">
                            <button
                                onClick={() => toast.remove(t.id)}
                                className="w-full h-full border border-transparent rounded-b-lg sm:rounded-b-none sm:rounded-r-lg p-4 flex items-center justify-center text-xs sm:text-sm font-medium text-indigo-500 hover:text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ),
                {
                    duration: 20000,
                    position: 'bottom-center',
                }
            );
        }, 500);
    
        return () => clearTimeout(timer);
    }, [hasInteracted, toast, assets.tte_transparent_logo]);    
    
    if (loading) {
        return (
            <Loader />
        );
    }
    return (
        <div>
            <Hero />
            <LatestContent/>
            <Features />
            <HowItWorks />
            <ImpactSection />
            <Footer />
        </div>

    )
}

export default Landing