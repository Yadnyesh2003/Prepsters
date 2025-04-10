import React, { useState } from 'react';
import { db, collection, addDoc, serverTimestamp, updateDoc } from "../../config/firebase";

const AddSyllabus = () => {
  const [formData, setFormData] = useState({
    syllabusCategory: {
      academicYear: '',
      branch: '',
      institution: '',
      year: '',
    },
    syllabusLink: '',
    syllabusTitle: '',
    adminId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('syllabusCategory')) {
      const path = name.split('.'); // Split name into parts
      const field = path.pop(); // Get the last part (e.g., 'academicYear')
      
      setFormData(prevData => {
        const updatedCategory = { ...prevData.syllabusCategory };
        
        if (type === 'checkbox') {
          // Handling checkbox for branch
          if (name === 'syllabusCategory.branch') {
            if (checked) {
              updatedCategory.branch.push(value);
            } else {
              updatedCategory.branch = updatedCategory.branch.filter((item) => item !== value);
            }
          }
        } else {
          updatedCategory[field] = value;
        }
        
        return { ...prevData, syllabusCategory: updatedCategory };
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
      syllabusCategory: {
        ...prevData.syllabusCategory,
        year: selectedYear,  // Store the selected year as a string
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const syllabusRef = await addDoc(collection(db, 'Syllabus'), {
        ...formData,
        createdAt: serverTimestamp(),
        createdBy: 'auth.currentUser.displayName', // Correct this line if you have Firebase Auth setup
        adminId: 'req.auth.userId'
      });
      alert('Data submitted successfully!');

      await updateDoc(syllabusRef, {
        syllabusId: syllabusRef.id
      });

      setFormData({
        syllabusCategory: {
          academicYear: '',
          branch: [],
          institution: '',
          year: '',
        },
        syllabusLink: '',
        syllabusTitle: '',
      })

    } catch (error) {
      setError('Error adding document: ', + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-7 ml-3 p-6 bg-white overflow-scroll flex flex-col justify-between text-gray-700">
      
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col w-3/4 gap-4 text-gray-500">
        {/* Syllabus Title */}
        <div className="flex flex-col gap-2">
          <p className="text-lg text-left">Syllabus Title</p>
          <input
            type="text"
            name="syllabusTitle"
            value={formData.syllabusTitle}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Academic Year */}
        <div className="flex flex-col gap-2">
          <p className="text-lg text-left">Academic Year</p>
          <input
            type="text"
            name="syllabusCategory.academicYear"
            value={formData.syllabusCategory.academicYear}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Example: 2022-2023"
            required
          />
        </div>

        {/* Branch */}
        <div className='space-y-2 '>
          <p className="text-lg text-left">Branch</p>
          <div className="flex flex-col gap-2 text-left">
            {[  
                "General Science & Humanities",
                "Computer Engineering",
                "Information Technology",
                "Electronics & Telecommunication",
                "Artificial Intelligence & Data Science",
                "Electronics & Computer Science",
              ].map((branch) => (
              <label key={branch} className='flex items-center gap-2 hover:text-amber-400'>
                <input
                  type="radio"
                  name="syllabusCategory.branch"
                  value={branch}
                  checked={formData.syllabusCategory.branch===branch}
                  onChange={handleChange}
                  className="mr-2  hover:text-amber-400"
                />
                <span>{branch}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Institution */}
        <div className='flex flex-col gap-2'>
          <p className="text-lg text-left">Institution</p>
          <input
            type="text"
            name="syllabusCategory.institution"
            value={formData.syllabusCategory.institution}
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
                  checked={formData.syllabusCategory.year === year} // Check if the year is selected
                  onChange={handleYearChange} // Handle year change
                  className="accent-blue-600"
                />
                <span>{year}</span>
              </label>
            ))}
          </div>
        </div>

        {/* PYQS Link */}
        <div className='flex flex-col gap-2'>
          <p className="text-lg text-left">Syllabus Link</p>
          <input
            type="url"
            name="pyqsLink"
            value={formData.syllabusLink}
            onChange={(e) => {
              const modifiedLink = e.target.value.replace(/\/view\?usp=drive_link$/, '/preview');
              setFormData({
                ...formData,
                syllabusLink: modifiedLink,
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
          {loading ? "Adding Syllabus..." : "ADD SYLLABUS"}
        </button>
      </form>
    </div>
  );
};

export default AddSyllabus;