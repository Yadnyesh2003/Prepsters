// // import React, { useState, useEffect, useContext } from 'react'
// // import Navbar from '../../components/student/NavBar'
// // import Hero from '../../components/student/Hero'
// // import Features from '../../components/student/Features'
// // import HowItWorks from '../../components/student/HowItWorks'
// // import ImpactSection from '../../components/student/Impacts'
// // import Footer from '../../components/student/Footer'
// // import Loader from '../../components/student/Loading'
// // import { useTheme } from '../../context/ThemeContext'
// // import LatestContent from '../../components/student/LatestContent'
// // import { AppContext } from '../../context/AppContext'
// // import { assets, popSound } from '../../assets/assets'


// // function Landing() {

// //     const { loading } = useTheme();
// //     const { toast } = useContext(AppContext);

// //     const [hasInteracted, setHasInteracted] = useState(false);

// //     useEffect(() => {
// //         const handleInteraction = () => {
// //             setHasInteracted(true);
// //             window.removeEventListener('click', handleInteraction);
// //         };

// //         window.addEventListener('click', handleInteraction);

// //         return () => window.removeEventListener('click', handleInteraction);
// //     }, []);

// //     useEffect(() => {
// //         if (!hasInteracted) return;

// //         const timer = setTimeout(() => {
// //             const sound = popSound.cloneNode();
// //             sound.play().catch((e) => console.error('Sound play error:', e));

// //             toast.dismiss();

// //             toast.custom(
// //                 (t) => (
// //                     <div
// //                         className={`${
// //                             t.visible ? 'animate-enter' : 'animate-leave'
// //                         } max-w-md w-full bg-purple-100 shadow-lg rounded-lg pointer-events-auto flex flex-col sm:flex-row ring-1 ring-black ring-opacity-5`}
// //                     >
// //                         <div className="flex-1 w-full p-4">
// //                             <div className="flex items-center space-x-3 mb-2">
// //                                 <img
// //                                     className="h-8 w-8 sm:h-8 sm:w-8 rounded-full"
// //                                     src={assets.tte_transparent_logo}
// //                                     alt="Warning"
// //                                 />
// //                                 <p className="text-sm sm:text-base font-medium text-gray-900">
// //                                     Please note the following points:
// //                                 </p>
// //                             </div>

// //                             <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-900 space-y-2 pl-5">
// //                                 <li>
// //                                     For accessing <strong>"First Year"</strong> Syllabus/ PYQs/ FAQs/ Notes, please select <strong>"General Science & Humanities"</strong> as branch. Other branches won't return First Year data.
// //                                 </li>
// //                                 <li>
// //                                     Each filter application increases API reads and affects billing 💸. Kindly avoid unnecessary filter requests 🙏.
// //                                 </li>
// //                             </ol>
// //                         </div>
// //                         <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200">
// //                             <button
// //                                 onClick={() => toast.remove(t.id)}
// //                                 className="w-full h-full border border-transparent rounded-b-lg sm:rounded-b-none sm:rounded-r-lg p-4 flex items-center justify-center text-xs sm:text-sm font-medium text-indigo-500 hover:text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                             >
// //                                 Close
// //                             </button>
// //                         </div>
// //                     </div>
// //                 ),
// //                 {
// //                     duration: 20000,
// //                     position: 'bottom-center',
// //                 }
// //             );
// //         }, 500);

// //         return () => clearTimeout(timer);
// //     }, [hasInteracted, toast, assets.tte_transparent_logo]);    

// //     if (loading) {
// //         return (
// //             <Loader />
// //         );
// //     }
// //     return (
// //         <div>
// //             <Hero />
// //             <LatestContent/>
// //             <Features />
// //             <HowItWorks />
// //             <ImpactSection />
// //             <Footer />
// //         </div>

// //     )
// // }

// // export default Landing




// import React, { useState, useEffect, useContext } from 'react'
// import Navbar from '../../components/student/NavBar'
// import Hero from '../../components/student/Hero'
// import Features from '../../components/student/Features'
// import HowItWorks from '../../components/student/HowItWorks'
// import ImpactSection from '../../components/student/Impacts'
// import Footer from '../../components/student/Footer'
// import Loader from '../../components/student/Loading'
// import { useTheme } from '../../context/ThemeContext'
// import LatestContent from '../../components/student/LatestContent'
// import { AppContext } from '../../context/AppContext'
// import { assets, popSound } from '../../assets/assets'
// import { useAuth } from '../../context/AuthContext'
// import { Doughnut } from 'react-chartjs-2'
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
// import { doc, getDoc } from 'firebase/firestore'
// import { db } from '../../config/firebase'

// // Register ChartJS components
// ChartJS.register(ArcElement, Tooltip, Legend);

// function Landing() {
//     const { loading } = useTheme();
//     const { toast } = useContext(AppContext);
//     const { user, isProfileComplete, loading: authLoading } = useAuth();
//     const [hasInteracted, setHasInteracted] = useState(false);
//     const [showProfileReminder, setShowProfileReminder] = useState(false);
//     const [profileCompletion, setProfileCompletion] = useState(0);
//     const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

//     // Calculate profile completion percentage and show reminder if needed
//     useEffect(() => {
//         if (user && !hasCheckedProfile) {
//             const calculateCompletion = async () => {
//                 let completion = 0;
//                 const weights = {
//                     userEmail: 20,
//                     userName: 15,
//                     userAvatar: 15,
//                     userInstitution: 20,
//                     userYear: 15,
//                     userBranch: 15
//                 };

//                 try {
//                     const userRef = doc(db, "Users", user.uid);
//                     const userDoc = await getDoc(userRef);

//                     if (userDoc.exists()) {
//                         const data = userDoc.data();

//                         // Check each field and add to completion
//                         if (data.userEmail && data.userEmail.trim() !== '') completion += weights.userEmail;
//                         if (data.userName && data.userName.trim() !== '') completion += weights.userName;
//                         if (data.userAvatar !== null) completion += weights.userAvatar;

//                         // Check userData fields
//                         if (data.userData) {
//                             if (data.userData.userInstitution && data.userData.userInstitution.trim() !== '') {
//                                 completion += weights.userInstitution;
//                             }
//                             if (data.userData.userYear && data.userData.userYear.trim() !== '') {
//                                 completion += weights.userYear;
//                             }
//                             if (data.userData.userBranch && data.userData.userBranch.trim() !== '') {
//                                 completion += weights.userBranch;
//                             }
//                         }
//                     }

//                     setProfileCompletion(Math.min(100, completion));
//                     setHasCheckedProfile(true);

//                     // Show reminder if profile isn't complete
//                     if (userDoc.exists() && !userDoc.data().isProfileComplete) {
//                         setShowProfileReminder(false);
//                     }
//                 } catch (error) {
//                     console.error("Error checking profile data:", error);
//                 }
//             };

//             calculateCompletion();
//         }
//     }, [user, hasCheckedProfile]);

//     // Reset hasCheckedProfile when user logs out
//     useEffect(() => {
//         if (!user) {
//             setHasCheckedProfile(false);
//         }
//     }, [user]);

//     useEffect(() => {
//         const handleInteraction = () => {
//             setHasInteracted(true);
//             window.removeEventListener('click', handleInteraction);
//         };

//         window.addEventListener('click', handleInteraction);

//         return () => window.removeEventListener('click', handleInteraction);
//     }, []);

//     useEffect(() => {
//         if (!hasInteracted) return;

//         const timer = setTimeout(() => {
//             const sound = popSound.cloneNode();
//             sound.play().catch((e) => console.error('Sound play error:', e));

//             toast.dismiss();

//             toast.custom(
//                 (t) => (
//                     <div
//                         className={`${t.visible ? 'animate-enter' : 'animate-leave'
//                             } max-w-md w-full bg-purple-100 shadow-lg rounded-lg pointer-events-auto flex flex-col sm:flex-row ring-1 ring-black ring-opacity-5`}
//                     >
//                         <div className="flex-1 w-full p-4">
//                             <div className="flex items-center space-x-3 mb-2">
//                                 <img
//                                     className="h-8 w-8 sm:h-8 sm:w-8 rounded-full"
//                                     src={assets.tte_transparent_logo}
//                                     alt="Warning"
//                                 />
//                                 <p className="text-sm sm:text-base font-medium text-gray-900">
//                                     Please note the following points:
//                                 </p>
//                             </div>

//                             <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-900 space-y-2 pl-5">
//                                 <li>
//                                     For accessing <strong>"First Year"</strong> Syllabus/ PYQs/ FAQs/ Notes, please select <strong>"General Science & Humanities"</strong> as branch. Other branches won't return First Year data.
//                                 </li>
//                                 <li>
//                                     Each filter application increases API reads and affects billing 💸. Kindly avoid unnecessary filter requests 🙏.
//                                 </li>
//                             </ol>
//                         </div>
//                         <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200">
//                             <button
//                                 onClick={() => toast.remove(t.id)}
//                                 className="w-full h-full border border-transparent rounded-b-lg sm:rounded-b-none sm:rounded-r-lg p-4 flex items-center justify-center text-xs sm:text-sm font-medium text-indigo-500 hover:text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 ),
//                 {
//                     duration: 20000,
//                     position: 'bottom-center',
//                 }
//             );
//         }, 500);

//         return () => clearTimeout(timer);
//     }, [hasInteracted, toast, assets.tte_transparent_logo]);

//     if (loading || authLoading) {
//         return <Loader />;
//     }

//     // Donut chart data
//     const donutData = {
//         labels: ['Completed', 'Remaining'],
//         datasets: [
//             {
//                 data: [profileCompletion, 100 - profileCompletion],
//                 backgroundColor: ['#4f46e5', '#e5e7eb'],
//                 borderWidth: 0,
//             },
//         ],
//     };

//     const donutOptions = {
//         cutout: '70%',
//         plugins: {
//             legend: {
//                 display: false,
//             },
//             tooltip: {
//                 enabled: false,
//             },
//         },
//     };

//     return (
//         <div>
//             {/* Profile Reminder Modal - Only shown when logged in with incomplete profile */}
//             {user && !showProfileReminder && !isProfileComplete && (
//                 <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
//                         <div className="flex justify-between items-start mb-4">
//                             <h3 className="text-xl font-bold text-gray-900">Complete Your Profile</h3>
//                             <button
//                                 onClick={() => setShowProfileReminder(false)}
//                                 className="text-gray-400 hover:text-gray-500"
//                             >
//                                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                         </div>

//                         <div className="mb-6">
//                             <p className="text-gray-600 mb-4">
//                                 To access all features and materials, please complete your profile setup.
//                                 This helps us personalize your experience.
//                             </p>

//                             <div className="flex justify-center mb-4">
//                                 <div className="w-32 h-32 relative">
//                                     <Doughnut data={donutData} options={donutOptions} />
//                                     <div className="absolute inset-0 flex items-center justify-center">
//                                         <span className="text-2xl font-bold text-indigo-600">
//                                             {profileCompletion}%
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="space-y-2">
//                                 {[
//                                     { label: 'Email', completed: profileCompletion >= 20 },
//                                     { label: 'Name', completed: profileCompletion >= 35 },
//                                     { label: 'Avatar', completed: profileCompletion >= 50 },
//                                     { label: 'Institution', completed: profileCompletion >= 70 },
//                                     { label: 'Year & Branch', completed: profileCompletion >= 100 }
//                                 ].map((item, index) => (
//                                     <div key={index} className="flex items-center">
//                                         <span className={`inline-block w-4 h-4 rounded-full mr-2 ${item.completed ? 'bg-indigo-500' : 'bg-gray-300'}`}></span>
//                                         <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
//                                             {item.label}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="flex justify-between space-x-4">
//                             <button
//                                 onClick={() => setShowProfileReminder(false)}
//                                 className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             >
//                                 Skip for Now
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setShowProfileReminder(false);
//                                     window.location.href = '/profile';
//                                 }}
//                                 className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             >
//                                 Complete Profile
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Profile Completion Banner - Only shown when logged in with incomplete profile */}
//             {user && !isProfileComplete && !showProfileReminder && (
//                 <div className="bg-indigo-50 border-b border-indigo-100">
//                     <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
//                         <div className="flex items-center justify-between flex-wrap">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0 w-8 h-8 mr-3">
//                                     <Doughnut data={donutData} options={donutOptions} />
//                                 </div>
//                                 <p className="text-sm text-indigo-800">
//                                     Your profile is {profileCompletion}% complete. <strong>Complete your profile</strong> to access all features.
//                                 </p>
//                             </div>
//                             <div className="flex-shrink-0">
//                                 <button
//                                     onClick={() => window.location.href = '/profile'}
//                                     className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
//                                 >
//                                     Complete Now &rarr;
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <Hero />
//             <LatestContent />
//             <Features />
//             <HowItWorks />
//             <ImpactSection />
//             <Footer />
//         </div>
//     )
// }

// export default Landing








// import React, { useState, useEffect, useContext } from 'react'
// import Navbar from '../../components/student/NavBar'
// import Hero from '../../components/student/Hero'
// import Features from '../../components/student/Features'
// import HowItWorks from '../../components/student/HowItWorks'
// import ImpactSection from '../../components/student/Impacts'
// import Footer from '../../components/student/Footer'
// import Loader from '../../components/student/Loading'
// import { useTheme } from '../../context/ThemeContext'
// import LatestContent from '../../components/student/LatestContent'
// import { AppContext } from '../../context/AppContext'
// import { assets, popSound } from '../../assets/assets'
// import { useAuth } from '../../context/AuthContext'
// import { Doughnut } from 'react-chartjs-2'
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
// import { doc, getDoc } from 'firebase/firestore'
// import { db } from '../../config/firebase'

// // Register ChartJS components
// ChartJS.register(ArcElement, Tooltip, Legend);

// function Landing() {
//     const { loading } = useTheme();
//     const { toast } = useContext(AppContext);
//     const { user, isProfileComplete, loading: authLoading } = useAuth();
//     const [hasInteracted, setHasInteracted] = useState(false);
//     const [showProfileReminder, setShowProfileReminder] = useState(false);
//     const [profileCompletion, setProfileCompletion] = useState(0);
//     const [hasCheckedProfile, setHasCheckedProfile] = useState(false);
//     const [profileFullyCompleted, setProfileFullyCompleted] = useState(false);

//     // Calculate profile completion percentage and show reminder if needed
//     useEffect(() => {
//         if (user && !hasCheckedProfile) {
//             const calculateCompletion = async () => {
//                 let completion = 0;
//                 const weights = {
//                     userEmail: 20,
//                     userName: 15,
//                     userAvatar: 15,
//                     userInstitution: 20,
//                     userYear: 15,
//                     userBranch: 15
//                 };

//                 try {
//                     const userRef = doc(db, "Users", user.uid);
//                     const userDoc = await getDoc(userRef);

//                     if (userDoc.exists()) {
//                         const data = userDoc.data();

//                         // Check each field and add to completion
//                         if (data.userEmail && data.userEmail.trim() !== '') completion += weights.userEmail;
//                         if (data.userName && data.userName.trim() !== '') completion += weights.userName;
//                         if (data.userAvatar !== null) completion += weights.userAvatar;

//                         // Check userData fields
//                         if (data.userData) {
//                             if (data.userData.userInstitution && data.userData.userInstitution.trim() !== '') {
//                                 completion += weights.userInstitution;
//                             }
//                             if (data.userData.userYear && data.userData.userYear.trim() !== '') {
//                                 completion += weights.userYear;
//                             }
//                             if (data.userData.userBranch && data.userData.userBranch.trim() !== '') {
//                                 completion += weights.userBranch;
//                             }
//                         }
//                     }

//                     const finalCompletion = Math.min(100, completion);
//                     setProfileCompletion(finalCompletion);
//                     setHasCheckedProfile(true);

//                     // Check if profile is fully completed
//                     if (finalCompletion === 100) {
//                         setProfileFullyCompleted(true);
//                         return;
//                     }

//                     // Show reminder if profile isn't complete and user hasn't dismissed it
//                     if (userDoc.exists() && !userDoc.data().isProfileComplete) {
//                         setShowProfileReminder(true);
//                     }
//                 } catch (error) {
//                     console.error("Error checking profile data:", error);
//                 }
//             };

//             calculateCompletion();
//         }
//     }, [user, hasCheckedProfile]);

//     // Reset hasCheckedProfile when user logs out
//     useEffect(() => {
//         if (!user) {
//             setHasCheckedProfile(false);
//             setProfileFullyCompleted(false);
//         }
//     }, [user]);

//     useEffect(() => {
//         const handleInteraction = () => {
//             setHasInteracted(true);
//             window.removeEventListener('click', handleInteraction);
//         };

//         window.addEventListener('click', handleInteraction);

//         return () => window.removeEventListener('click', handleInteraction);
//     }, []);



//     useEffect(() => {
//         if (!hasInteracted) return;

//         const timer = setTimeout(() => {
//             const sound = popSound.cloneNode();
//             sound.play().catch((e) => console.error('Sound play error:', e));

//             toast.dismiss();

//             toast.custom(
//                 (t) => (
//                     <div
//                         className={`${t.visible ? 'animate-enter' : 'animate-leave'
//                             } max-w-md w-full bg-purple-100 shadow-lg rounded-lg pointer-events-auto flex flex-col sm:flex-row ring-1 ring-black ring-opacity-5`}
//                     >
//                         <div className="flex-1 w-full p-4">
//                             <div className="flex items-center space-x-3 mb-2">
//                                 <img
//                                     className="h-8 w-8 sm:h-8 sm:w-8 rounded-full"
//                                     src={assets.tte_transparent_logo}
//                                     alt="Warning"
//                                 />
//                                 <p className="text-sm sm:text-base font-medium text-gray-900">
//                                     Please note the following points:
//                                 </p>
//                             </div>

//                             <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-900 space-y-2 pl-5">
//                                 <li>
//                                     For accessing <strong>"First Year"</strong> Syllabus/ PYQs/ FAQs/ Notes, please select <strong>"General Science & Humanities"</strong> as branch. Other branches won't return First Year data.
//                                 </li>
//                                 <li>
//                                     Each filter application increases API reads and affects billing 💸. Kindly avoid unnecessary filter requests 🙏.
//                                 </li>
//                             </ol>
//                         </div>
//                         <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200">
//                             <button
//                                 onClick={() => toast.remove(t.id)}
//                                 className="w-full h-full border border-transparent rounded-b-lg sm:rounded-b-lg sm:rounded-r-lg p-4 flex items-center justify-center text-xs sm:text-sm font-medium text-indigo-500 hover:text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 ),
//                 {
//                     duration: 20000,
//                     position: 'bottom-center',
//                 }
//             );
//         }, 500);

//         return () => clearTimeout(timer);
//     }, [hasInteracted, toast, assets.tte_transparent_logo]);


//     // useEffect(() => {
//     //     if (!hasInteracted) return;

//     //     const timer = setTimeout(() => {
//     //         const sound = popSound.cloneNode();
//     //         sound.play().catch((e) => console.error('Sound play error:', e));

//     //         toast.dismiss();

//     //         toast.custom(
//     //             (t) => (
//     //                 <div
//     //                     className={`${t.visible ? 'animate-enter' : 'animate-leave'
//     //                         } max-w-md w-full bg-gradient-to-br from-purple-50 to-indigo-50 shadow-xl rounded-xl pointer-events-auto flex flex-col sm:flex-row ring-2 ring-purple-200 ring-opacity-50 backdrop-blur-sm`}
//     //                 >
//     //                     <div className="flex-1 w-full p-5">
//     //                         <div className="flex items-center space-x-3 mb-3">
//     //                             <img
//     //                                 className="h-10 w-10 sm:h-10 sm:w-10 rounded-full border-2 border-purple-200 p-1"
//     //                                 src={assets.tte_transparent_logo}
//     //                                 alt="Warning"
//     //                             />
//     //                             <p className="text-sm sm:text-base font-semibold text-purple-900">
//     //                                 Important Notice
//     //                             </p>
//     //                         </div>

//     //                         <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-800 space-y-2 pl-5 marker:text-purple-500 marker:font-semibold">
//     //                             <li className="mb-2">
//     //                                 For accessing <strong className="text-purple-700">"First Year"</strong> Syllabus/ PYQs/ FAQs/ Notes, please select <strong className="text-purple-700">"General Science & Humanities"</strong> as branch. Other branches won't return First Year data.
//     //                             </li>
//     //                             <li>
//     //                                 Each filter application increases API reads and affects billing <span className="text-purple-700">💸</span>. Kindly avoid unnecessary filter requests <span className="text-purple-700">🙏</span>.
//     //                             </li>
//     //                         </ol>
//     //                     </div>
//     //                     <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-purple-100">
//     //                         <button
//     //                             onClick={() => toast.remove(t.id)}
//     //                             className="w-full h-full border border-transparent rounded-b-xl sm:rounded-b-none sm:rounded-r-xl p-4 flex items-center justify-center text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
//     //                         >
//     //                             Got it!
//     //                         </button>
//     //                     </div>
//     //                 </div>
//     //             ),
//     //             {
//     //                 duration: 20000,
//     //                 position: 'bottom-center',
//     //             }
//     //         );
//     //     }, 500);

//     //     return () => clearTimeout(timer);
//     // }, [hasInteracted, toast, assets.tte_transparent_logo]);

//     if (loading || authLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
//                 <Loader />
//             </div>
//         );
//     }

//     // Donut chart data
//     const donutData = {
//         labels: ['Completed', 'Remaining'],
//         datasets: [
//             {
//                 data: [profileCompletion, 100 - profileCompletion],
//                 backgroundColor: profileCompletion === 100 ? ['#10b981', '#e5e7eb'] : ['#6366f1', '#e0e7ff'],
//                 borderWidth: 0,
//                 hoverBackgroundColor: profileCompletion === 100 ? ['#059669', '#d1d5db'] : ['#4f46e5', '#c7d2fe'],
//             },
//         ],
//     };

//     const donutOptions = {
//         cutout: '70%',
//         plugins: {
//             legend: {
//                 display: false,
//             },
//             tooltip: {
//                 enabled: false,
//             },
//         },
//         animation: {
//             animateScale: true,
//             animateRotate: true
//         }
//     };

//     return (
//         <div className="bg-gradient-to-b from-white to-purple-50 min-h-screen">
//             {/* Profile Completion Banner - Only shown when logged in with incomplete profile */}
//             {user && !isProfileComplete && !profileFullyCompleted && !showProfileReminder && (
//                 <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 shadow-sm">
//                     <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//                         <div className="flex items-center justify-between flex-wrap">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0 w-12 h-12 mr-3 relative">
//                                     <Doughnut data={donutData} options={donutOptions} />
//                                     <div className="absolute inset-0 flex items-center justify-center">
//                                         <span className="text-xs font-bold text-indigo-600">
//                                             {profileCompletion}%
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <p className="text-sm text-indigo-800">
//                                     <span className="font-medium">Profile incomplete!</span> Complete your profile to unlock all features and personalized content.
//                                 </p>
//                             </div>
//                             <div className="flex-shrink-0 mt-2 sm:mt-0">
//                                 <button
//                                     onClick={() => window.location.href = '/profile'}
//                                     className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
//                                 >
//                                     Complete Now
//                                     <svg className="ml-1 -mr-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Profile Fully Completed Banner - Only shown once when profile reaches 100% */}
//             {user && profileFullyCompleted && (
//                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 shadow-sm">
//                     <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
//                         <div className="flex items-center justify-between flex-wrap">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0 w-12 h-12 mr-3 relative">
//                                     <Doughnut data={donutData} options={donutOptions} />
//                                     <div className="absolute inset-0 flex items-center justify-center">
//                                         <span className="text-xs font-bold text-green-600">
//                                             100%
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <p className="text-sm text-green-800">
//                                     <span className="font-medium">Profile complete!</span> You now have full access to all features.
//                                 </p>
//                             </div>
//                             <div className="flex-shrink-0">
//                                 <button
//                                     onClick={() => setProfileFullyCompleted(false)}
//                                     className="text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none"
//                                 >
//                                     Dismiss
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Profile Reminder Modal - Only shown when logged in with incomplete profile */}
//             {user && showProfileReminder && !isProfileComplete && !profileFullyCompleted && (
//                 <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
//                     <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
//                         <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
//                             <div className="flex justify-between items-center">
//                                 <h3 className="text-xl font-bold text-white">Complete Your Profile</h3>
//                                 <button
//                                     onClick={() => setShowProfileReminder(false)}
//                                     className="text-white hover:text-indigo-200 transition-colors duration-200"
//                                 >
//                                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="p-6">
//                             <p className="text-gray-600 mb-6 text-center">
//                                 To unlock all features and personalized content, please complete your profile setup.
//                             </p>

//                             <div className="flex justify-center mb-6">
//                                 <div className="w-40 h-40 relative">
//                                     <Doughnut data={donutData} options={donutOptions} />
//                                     <div className="absolute inset-0 flex items-center justify-center flex-col">
//                                         <span className="text-3xl font-bold text-indigo-600">
//                                             {profileCompletion}%
//                                         </span>
//                                         <span className="text-xs text-gray-500 mt-1">Completed</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="space-y-3 mb-6">
//                                 {[
//                                     { label: 'Email', completed: profileCompletion >= 20 },
//                                     { label: 'Name', completed: profileCompletion >= 35 },
//                                     { label: 'Avatar', completed: profileCompletion >= 50 },
//                                     { label: 'Institution', completed: profileCompletion >= 70 },
//                                     { label: 'Year & Branch', completed: profileCompletion >= 100 }
//                                 ].map((item, index) => (
//                                     <div key={index} className="flex items-center">
//                                         <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 ${item.completed ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
//                                             {item.completed ? (
//                                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                                 </svg>
//                                             ) : (
//                                                 <span className="text-xs">{index + 1}</span>
//                                             )}
//                                         </span>
//                                         <span className={`text-sm ${item.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
//                                             {item.label}
//                                         </span>
//                                         {item.completed && (
//                                             <span className="ml-auto text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
//                                                 Complete
//                                             </span>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="flex justify-between space-x-4">
//                                 <button
//                                     onClick={() => setShowProfileReminder(false)}
//                                     className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
//                                 >
//                                     Maybe Later
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         setShowProfileReminder(false);
//                                         window.location.href = '/profile';
//                                     }}
//                                     className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200"
//                                 >
//                                     Complete Now
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="overflow-hidden">
//                 <Hero />
//                 <LatestContent />
//                 <Features />
//                 <HowItWorks />
//                 <ImpactSection />
//                 <Footer />
//             </div>
//         </div>
//     )
// }

// export default Landing






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
import { useAuth } from '../../context/AuthContext'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function Landing() {
    const { loading } = useTheme();
    const { toast } = useContext(AppContext);
    const { user, isProfileComplete, loading: authLoading } = useAuth();
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showProfileReminder, setShowProfileReminder] = useState(false);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [hasCheckedProfile, setHasCheckedProfile] = useState(false);
    const [profileFullyCompleted, setProfileFullyCompleted] = useState(false);
    const [hasShownCompletionBanner, setHasShownCompletionBanner] = useState(false);

    // Calculate profile completion percentage and show reminder if needed
    useEffect(() => {
        if (user && !hasCheckedProfile) {
            const calculateCompletion = async () => {
                let completion = 0;
                const weights = {
                    userEmail: 20,
                    userName: 15,
                    userAvatar: 15,
                    userInstitution: 20,
                    userYear: 15,
                    userBranch: 15
                };

                try {
                    const userRef = doc(db, "Users", user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const data = userDoc.data();

                        // Check each field and add to completion
                        if (data.userEmail && data.userEmail.trim() !== '') completion += weights.userEmail;
                        if (data.userName && data.userName.trim() !== '') completion += weights.userName;
                        if (data.userAvatar !== null) completion += weights.userAvatar;

                        // Check userData fields
                        if (data.userData) {
                            if (data.userData.userInstitution && data.userData.userInstitution.trim() !== '') {
                                completion += weights.userInstitution;
                            }
                            if (data.userData.userYear && data.userData.userYear.trim() !== '') {
                                completion += weights.userYear;
                            }
                            if (data.userData.userBranch && data.userData.userBranch.trim() !== '') {
                                completion += weights.userBranch;
                            }
                        }
                    }

                    const finalCompletion = Math.min(100, completion);
                    setProfileCompletion(finalCompletion);
                    setHasCheckedProfile(true);

                    // Check if profile is fully completed
                    if (finalCompletion === 100) {
                        // Only show banner if profile wasn't already complete
                        if (!isProfileComplete) {
                            setProfileFullyCompleted(true);
                            // Mark profile as complete in Firestore
                            await updateDoc(doc(db, "Users", user.uid), {
                                isProfileComplete: true
                            });
                        }
                        return;
                    }

                    // Show reminder if profile isn't complete and user hasn't dismissed it
                    if (userDoc.exists() && !userDoc.data().isProfileComplete) {
                        setShowProfileReminder(true);
                    }
                } catch (error) {
                    console.error("Error checking profile data:", error);
                }
            };

            calculateCompletion();
        }
    }, [user, hasCheckedProfile, isProfileComplete]);

    // Reset hasCheckedProfile when user logs out
    useEffect(() => {
        if (!user) {
            setHasCheckedProfile(false);
            setProfileFullyCompleted(false);
        }
    }, [user]);

    useEffect(() => {
        document.title = "Landing"

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
            // Only show popup if profile is not complete
            if (user && !isProfileComplete) {
                const sound = popSound.cloneNode();
                sound.play().catch((e) => console.error('Sound play error:', e));

                toast.dismiss();

                toast.custom(
                    (t) => (
                        <div
                            className={`${t.visible ? 'animate-enter' : 'animate-leave'
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
                                    className="w-full h-full border border-transparent rounded-b-lg sm:rounded-b-lg sm:rounded-r-lg p-4 flex items-center justify-center text-xs sm:text-sm font-medium text-indigo-500 hover:text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [hasInteracted, toast, assets.tte_transparent_logo, user, isProfileComplete]);

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <Loader />
            </div>
        );
    }

    // Donut chart data
    const donutData = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [profileCompletion, 100 - profileCompletion],
                backgroundColor: profileCompletion === 100 ? ['#10b981', '#e5e7eb'] : ['#6366f1', '#e0e7ff'],
                borderWidth: 0,
                hoverBackgroundColor: profileCompletion === 100 ? ['#059669', '#d1d5db'] : ['#4f46e5', '#c7d2fe'],
            },
        ],
    };

    const donutOptions = {
        cutout: '70%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    return (
        <div className="bg-gradient-to-b from-white to-purple-50 min-h-screen">
            {/* Profile Completion Banner - Only shown when logged in with incomplete profile */}
            {user && !isProfileComplete && !profileFullyCompleted && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-12 h-12 mr-3 relative">
                                    <Doughnut data={donutData} options={donutOptions} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-bold text-indigo-600">
                                            {profileCompletion}%
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-indigo-800">
                                    <span className="font-medium">Profile incomplete!</span> Complete your profile to unlock all features and personalized content.
                                </p>
                            </div>
                            <div className="flex-shrink-0 mt-2 sm:mt-0">
                                <button
                                    onClick={() => window.location.href = '/profile'}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                >
                                    Complete Now
                                    <svg className="ml-1 -mr-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Fully Completed Banner - Only shown once when profile reaches 100% */}
            {/* {user && profileFullyCompleted && !hasShownCompletionBanner && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-12 h-12 mr-3 relative">
                                    <Doughnut data={donutData} options={donutOptions} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-bold text-green-600">
                                            100%
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-green-800">
                                    <span className="font-medium">Profile complete!</span> You now have full access to all features.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => {
                                        setHasShownCompletionBanner(true);
                                        setProfileFullyCompleted(true);
                                    }}
                                    className="text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Profile Reminder Modal - Only shown when logged in with incomplete profile */}
            {user && showProfileReminder && !isProfileComplete && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Complete Your Profile</h3>
                                <button
                                    onClick={() => setShowProfileReminder(false)}
                                    className="text-white hover:text-indigo-200 transition-colors duration-200"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 mb-6 text-center">
                                To unlock all features and personalized content, please complete your profile setup.
                            </p>

                            <div className="flex justify-center mb-6">
                                <div className="w-40 h-40 relative">
                                    <Doughnut data={donutData} options={donutOptions} />
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-3xl font-bold text-indigo-600">
                                            {profileCompletion}%
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">Completed</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                {[
                                    { label: 'Email', completed: profileCompletion >= 20 },
                                    { label: 'Name', completed: profileCompletion >= 35 },
                                    { label: 'Avatar', completed: profileCompletion >= 50 },
                                    { label: 'Institution', completed: profileCompletion >= 70 },
                                    { label: 'Year & Branch', completed: profileCompletion >= 100 }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 ${item.completed ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {item.completed ? (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <span className="text-xs">{index + 1}</span>
                                            )}
                                        </span>
                                        <span className={`text-sm ${item.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                            {item.label}
                                        </span>
                                        {item.completed && (
                                            <span className="ml-auto text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                                Complete
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between space-x-4">
                                <button
                                    onClick={() => setShowProfileReminder(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    Maybe Later
                                </button>
                                <button
                                    onClick={() => {
                                        setShowProfileReminder(false);
                                        window.location.href = '/profile';
                                    }}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    Complete Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-hidden">
                <Hero />
                <LatestContent />
                <Features />
                <HowItWorks />
                <ImpactSection />
                <Footer />
            </div>
        </div>
    )
}

export default Landing