import React, { useContext, useState } from 'react';
import { db, collection, addDoc, serverTimestamp, updateDoc } from "../../config/firebase";
import { useAuth } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import AccessForbidden from '../student/AccessForbidden';

const AddFAQs = () => {
  const [formData, setFormData] = useState({
    faqsCategory: {
      branch: [],
      institution: '',
      subjectName: '',
      year: '',
    },
    faqsLink: '',
    faqsTitle: '',
    contributorName: '',
    adminId: ''
  });
  const [loading, setLoading] = useState(false);

  const { toast } = useContext(AppContext);
  const { isGhost, user } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('faqsCategory')) {
      const path = name.split('.'); // Split name into parts
      const field = path.pop(); // Get the last part (e.g., 'academicYear')
      
      setFormData(prevData => {
        const updatedCategory = { ...prevData.faqsCategory };
        
        if (type === 'checkbox') {
          // Handling checkbox for branch
          if (name === 'faqsCategory.branch') {
            if (checked) {
              updatedCategory.branch.push(value);
            } else {
              updatedCategory.branch = updatedCategory.branch.filter((item) => item !== value);
            }
          }
        } else {
          updatedCategory[field] = value;
        }
        
        return { ...prevData, faqsCategory: updatedCategory };
      });
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle year checkbox selection
  const handleYearChange = (e) => {
    const selectedYear = e.target.value;

    // Only allow one selection
    setFormData((prevData) => ({
      ...prevData,
      faqsCategory: {
        ...prevData.faqsCategory,
        year: selectedYear,  // Store the selected year as a string
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if(isGhost) {
        const faqsRef = await addDoc(collection(db, 'FAQs'), {
          ...formData,
          createdAt: serverTimestamp(),
          createdBy: user.displayName, // Correct this line if you have Firebase Auth setup
          adminId: user.uid
        });
        toast.success('Added FAQs successfully!');

        await updateDoc(faqsRef, {
          faqsId: faqsRef.id
        });

        setFormData({
          faqsCategory: {
            branch: [],
            institution: '',
            year: '',
            subjectName:'',
          },
          faqsLink: '',
          contributorName: '',
          faqsTitle: '',
        })
      } else{
        toast('Unauthorized Access!', {icon: '🚫'})
      }
    } catch (error) {
      toast.error(`Oops! Couldn't add FAQs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return isGhost ? (
    <div className="mx-auto mt-7 ml-3 p-6 bg-white overflow-scroll flex flex-col justify-between text-gray-700">
      <form onSubmit={handleSubmit} className="flex flex-col w-3/4 gap-4 text-gray-500">
        {/* Syllabus Title */}
        <div className="flex flex-col gap-2">
          <p className="text-lg text-left">FAQs Title</p>
          <input
            type="text"
            name="faqsTitle"
            value={formData.faqsTitle}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Branch */}
        <div className='space-y-2 '>
          <p className="text-lg text-left">Branch</p>
          <div className="flex flex-col gap-2 text-left">
            {[  "Computer Engineering",
                "Information Technology",
                "Electronics & Telecommunication",
                "Artificial Intelligence & Data Science",
                "Electronics & Computer Science",
              ].map((branch) => (
              <label key={branch} className='flex items-center gap-2 hover:text-amber-400'>
                <input
                  type="checkbox"
                  name="faqsCategory.branch"
                  value={branch}
                  checked={formData.faqsCategory.branch.includes(branch)}
                  onChange={handleChange}
                  className="mr-2  hover:text-amber-400"
                />
                <span>{branch}</span>
              </label>
            ))}
          </div>
        </div>
  
        {/* Subject Name */}
        <div className='flex flex-col gap-2'>
          <p className="text-lg text-left">Subject Name</p>
          <input
            type="text"
            name="faqsCategory.subjectName"
            value={formData.faqsCategory.subjectName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Example: Operating System"
            required
          />
        </div>

        {/* Institution */}
        <div className='flex flex-col gap-2'>
          <p className="text-lg text-left">Institution</p>
          <input
            type="text"
            name="faqsCategory.institution"
            value={formData.faqsCategory.institution}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Example: Mumbai University"
            required
          />
        </div>

        {/* Year  */}
        <div className="space-y-2">
          <p className="text-lg text-left">Year</p>
          <div className="flex flex-col gap-2">
            {["First Year", "Second Year", "Third Year", "Final Year"].map((year) => (
              <label key={year} className="flex items-center gap-2 hover:text-amber-300">
                <input
                  type="radio"
                  value={year}
                  checked={formData.faqsCategory.year === year} // Check if the year is selected
                  onChange={handleYearChange} // Handle year change
                  className="accent-blue-600"
                />
                <span>{year}</span>
              </label>
            ))}
          </div>
        </div>

       {/* Contributor Name */}
        <div className='flex flex-col gap-2'>
          <p className="text-lg text-left">Contributor Name</p>
          <input
            type="text"
            name="contributorName"
            value={formData.contributorName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* FAQS Link */}
        <div className='flex flex-col gap-2'>
          <p className="text-lg text-left">FAQs Link</p>
          <input
            type="url"
            name="faqsLink"
            value={formData.faqsLink}
            onChange={(e) => {
              const modifiedLink = e.target.value.replace(/\/view\?usp=drive_link$/, '/preview');
              setFormData({
                ...formData,
                faqsLink: modifiedLink,
              });
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            placeholder='Enter GDrive PDF Link...'
          />
        </div>


        <button
          type="submit"
          className="bg-black text-white w-max py-2.5 px-8 rounded my-4 hover:bg-gray-400 hover:text-black"
          disabled={loading}
        >
          {loading ? "Adding FAQs..." : "ADD FAQs"}
        </button>
      </form>
    </div>
  ) : <AccessForbidden />
};

export default AddFAQs;