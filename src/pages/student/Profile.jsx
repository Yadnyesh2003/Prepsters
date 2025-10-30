import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { institutions, years, branches, avatarNicheOptions } from "../../assets/assets";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import ProfileBookmarksSection from '../../components/student/ProfileBookmarksSection';
import ResumeUpload from '../../components/student/ResumeUpload';
import { Doughnut } from 'react-chartjs-2'; // Add this import
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Add this import
ChartJS.register(ArcElement, Tooltip, Legend);

const animatedComponents = makeAnimated();

const Profile = () => {
  const { user, isProfileComplete, updateProfile } = useAuth();
  const { toast } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [avatarConfig, setAvatarConfig] = useState({
    niche: null,
    seed: null
  });
  const [formData, setFormData] = useState({
    institution: null,
    year: null,
    branch: null,
  });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showPdf, setShowPdf] = useState(false);

  
  // Calculate profile completion
  const calculateProfileCompletion = (userData) => {
    let completion = 0;
    const weights = {
      userEmail: 15,
      userName: 10,
      userAvatar: 10,
      userInstitution: 15,
      userYear: 10,
      userBranch: 10,
      resumes: 30 // 30% weight for resumes
    };

    if (userData) {
      // Check each field and add to completion
      if (userData.userEmail && userData.userEmail.trim() !== '') completion += weights.userEmail;
      if (userData.userName && userData.userName.trim() !== '') completion += weights.userName;
      if (userData.userAvatar !== null) completion += weights.userAvatar;

      // Check userData fields
      if (userData.userData) {
        if (userData.userData.userInstitution && userData.userData.userInstitution.trim() !== '') {
          completion += weights.userInstitution;
        }
        if (userData.userData.userYear && userData.userData.userYear.trim() !== '') {
          completion += weights.userYear;
        }
        if (userData.userData.userBranch && userData.userData.userBranch.trim() !== '') {
          completion += weights.userBranch;
        }
      }

      // Check resumes - user must have at least one resume
      if (userData.resumes && userData.resumes.length > 0) {
        completion += weights.resumes;
      }
    }

    return Math.min(100, completion);
  };

  // Fetch user data on component mount
  useEffect(() => {
    document.title = "Profile"
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, "Users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            
            // Calculate profile completion
            const completion = calculateProfileCompletion(data);
            setProfileCompletion(completion);

            // Set avatar config if exists
            if (data.userAvatar) {
              setAvatarConfig({
                niche: data.userAvatar.niche,
                seed: data.userAvatar.seed
              });
            }

            // Set form data if profile is complete
            if (data.isProfileComplete && data.userData) {
              setFormData({
                institution: data.userData.userInstitution,
                year: data.userData.userYear,
                branch: data.userData.userBranch,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load profile data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, toast]);

  const generateRandomAvatar = () => {
    // Randomly select a niche from the options
    const randomNiche = avatarNicheOptions[
      Math.floor(Math.random() * avatarNicheOptions.length)
    ];

    // Generate random seed (number between 1 and 9999)
    const randomSeed = Math.floor(Math.random() * 9999) + 1;

    setAvatarConfig({
      niche: randomNiche,
      seed: randomSeed
    });
  };

  const handleChange = (selectedOption, { name }) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!avatarConfig.niche || !avatarConfig.seed) {
      toast.error("Please generate an avatar first!");
      return;
    }

    if (!formData.institution || !formData.year || !formData.branch) {
      toast.error("Please fill all the required fields!");
      return;
    }

    try {
      const updatedData = {
        userAvatar: {
          niche: avatarConfig.niche,
          seed: avatarConfig.seed
        },
        userData: {
          userInstitution: formData.institution,
          userYear: formData.year,
          userBranch: formData.branch,
        },
        // Note: We don't set isProfileComplete to true here because resume is required
        profileCompletionPercentage: calculateProfileCompletion({
          ...userData,
          userAvatar: { niche: avatarConfig.niche, seed: avatarConfig.seed },
          userData: {
            userInstitution: formData.institution,
            userYear: formData.year,
            userBranch: formData.branch,
          }
        })
      };

      const success = await updateProfile(user.uid, updatedData);
      if (success) {
        toast.success("Profile saved successfully! Don't forget to upload at least one resume to complete your profile.");
        setIsEditing(false);
        // Update local state
        const newUserData = {
          ...userData,
          ...updatedData
        };
        setUserData(newUserData);
        setProfileCompletion(calculateProfileCompletion(newUserData));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    }
  };

  // View Mode - Show profile information
  if (!isEditing && userData?.isProfileComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 pt-6 pb-11 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-7">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              Your Profile
            </h1>
            <p className="mt-1 text-lg text-purple-700/80">
              View and manage your profile information
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl ">
            <div className="pb-18 p-8 flex flex-col md:flex-row gap-10">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6 group">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden border-4 border-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    {userData.userAvatar ? (
                      <img
                        src={`https://api.dicebear.com/9.x/${userData.userAvatar.niche}/png/seed=${userData.userAvatar.seed}`}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-20 w-20"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-11 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg hover:from-violet-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-8 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">{userData.userName}</h2>
                  <p className="text-purple-600">{userData.userEmail}</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-xl">
                    <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider mb-2">Institution</h3>
                    <p className="text-lg font-medium text-gray-900">
                      {institutions.find(i => i.value === userData.userData?.userInstitution)?.label || 'Not specified'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-xl">
                      <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider mb-2">Year of Study</h3>
                      <p className="text-lg font-medium text-gray-900">
                        {years.find(y => y.value === userData.userData?.userYear)?.label || 'Not specified'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-xl">
                      <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider mb-2">Branch</h3>
                      <p className="text-lg font-medium text-gray-900">
                        {branches.find(b => b.value === userData.userData?.userBranch)?.label || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {/* Resume Status */}
                  {/* <div className={`p-5 rounded-xl ${userData.resumes && userData.resumes.length > 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-amber-50 to-orange-50'}`}>
                    <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider mb-2">Resume Status</h3>
                    <p className="text-lg font-medium text-gray-900">
                      {userData.resumes && userData.resumes.length > 0 
                        ? `✅ ${userData.resumes.length} resume(s) uploaded` 
                        : '❌ No resume uploaded (required for complete profile)'}
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          
                <ResumeUpload />
         
          
          <div className="p-6 mt-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl ">
                <ProfileBookmarksSection />
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode or Incomplete Profile
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 pt-7 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-7">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
            {userData?.isProfileComplete ? "Edit Profile" : "Complete Your Profile"}
          </h1>
          <p className="mt-1 text-lg text-purple-700/80">
            {userData?.isProfileComplete
              ? "Update your profile information"
              : "Set up your profile to get started"}
          </p>
          {!userData?.isProfileComplete && (
            <p className="text-sm text-amber-600 mt-2">
              📄 Don't forget to upload at least one resume to complete your profile!
            </p>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
          <div className="p-8">
            {/* Profile Completion Status */}
            {!userData?.isProfileComplete && (
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-amber-800">Profile Completion: {profileCompletion}%</h3>
                    <p className="text-sm text-amber-600 mt-1">
                      Upload at least one resume to reach 100% completion
                    </p>
                  </div>
                  <div className="w-16 h-16">
                    <Doughnut 
                      data={{
                        labels: ['Completed', 'Remaining'],
                        datasets: [{
                          data: [profileCompletion, 100 - profileCompletion],
                          backgroundColor: ['#6366f1', '#e0e7ff'],
                          borderWidth: 0,
                        }]
                      }}
                      options={{
                        cutout: '70%',
                        plugins: { legend: { display: false }, tooltip: { enabled: false } }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Avatar Selection */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative mb-6 group">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden border-4 border-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  {avatarConfig.niche && avatarConfig.seed ? (
                    <img
                      src={`https://api.dicebear.com/9.x/${avatarConfig.niche}/png/seed=${avatarConfig.seed}`}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-purple-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={generateRandomAvatar}
                    type="button"
                    className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg hover:from-violet-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    New Avatar
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Institution */}
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-2">
                  Institution <span className="text-red-500">*</span>
                </label>
                <Select
                  name="institution"
                  isClearable
                  components={animatedComponents}
                  options={institutions}
                  placeholder="Select your institution"
                  value={institutions.find(opt => opt.value === formData.institution) || null}
                  onChange={(option, action) => handleChange(option, action)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#c4b5fd',
                      borderRadius: '0.5rem',
                      padding: '0.25rem',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        borderColor: '#a78bfa'
                      }
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected ? '#7c3aed' : isFocused ? '#ede9fe' : 'white',
                      color: isSelected ? 'white' : isFocused ? '#7c3aed' : '#4b5563',
                    })
                  }}
                />
              </div>

              {/* Year and Branch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                {/* Year */}
                <div className="">
                  <label className="block text-sm font-semibold text-purple-800 mb-2">
                    Year of Study <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="year"
                    isClearable
                    components={animatedComponents}
                    options={years}
                    placeholder="Select your year"
                    value={years.find(opt => opt.value === formData.year) || null}
                    onChange={(option, action) => handleChange(option, action)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#c4b5fd',
                        borderRadius: '0.5rem',
                        padding: '0.25rem',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        '&:hover': {
                          borderColor: '#a78bfa'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                        position: 'absolute',
                        width: '100%'
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? '#7c3aed' : isFocused ? '#ede9fe' : 'white',
                        color: isSelected ? 'white' : isFocused ? '#7c3aed' : '#4b5563',
                      })
                    }}
                  />
                </div>

                {/* Branch */}
                <div className="">
                  <label className="block text-sm font-semibold text-purple-800 mb-2">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="branch"
                    isClearable
                    components={animatedComponents}
                    options={branches}
                    placeholder="Select your branch"
                    value={branches.find(opt => opt.value === formData.branch) || null}
                    onChange={(option, action) => handleChange(option, action)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#c4b5fd',
                        borderRadius: '0.5rem',
                        padding: '0.25rem',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        '&:hover': {
                          borderColor: '#a78bfa'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                        position: 'absolute',
                        width: '100%'
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? '#7c3aed' : isFocused ? '#ede9fe' : 'white',
                        color: isSelected ? 'white' : isFocused ? '#7c3aed' : '#4b5563',
                      })
                    }}
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-between border-t border-purple-100">
                {userData?.isProfileComplete && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-7 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg hover:from-violet-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Profile
                </button>
              </div>
            </form>

            {/* Resume Section with Important Notice */}
            <div className="p-6 border-t border-purple-50 mt-8">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-purple-800">Resume Upload</h3>
                <p className="text-sm text-amber-600 mt-1">
                  📄 <strong>Important:</strong> Upload at least one resume to complete your profile and access all features.
                </p>
              </div>
              <ResumeUpload />
            </div>
          </div>
        </div>
      </div>
      {showPdf && <PdfViewer pdfUrl={url} onClose={() => setShowPdf(false)} />}
    </div>
  );
};

export default Profile;