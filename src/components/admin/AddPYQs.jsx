import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { db, collection, addDoc, serverTimestamp, updateDoc } from "../../config/firebase";
import { useAuth } from '../../context/AuthContext';
import AccessForbidden from '../student/AccessForbidden';

  const AddPYQs = () => {
    const [formData, setFormData] = useState({
      pyqsCategory: {
        academicYear: '',
        branch: [],
        institution: '',
        subjectName: [],
        year: '',
      },
      pyqsLink: '',
      pyqsTitle: '',
      adminId: ''
    });
    const [loading, setLoading] = useState(false);

    const { toast } = useContext(AppContext);
    const { isGhost, user } = useAuth();

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;

      // Check if the name contains 'pyqsCategory' to handle nested objects
      if (name.startsWith('pyqsCategory')) {
        const path = name.split('.'); // Split name into parts
        const field = path.pop(); // Get the last part (e.g., 'academicYear')
        
        setFormData(prevData => {
          const updatedCategory = { ...prevData.pyqsCategory };
          
          if (type === 'checkbox') {
            // Handling checkbox for branch
            if (name === 'pyqsCategory.branch') {
              if (checked) {
                updatedCategory.branch.push(value);
              } else {
                updatedCategory.branch = updatedCategory.branch.filter((item) => item !== value);
              }
            }
          } else if (name === 'pyqsCategory.subjectName') {
            // Handling comma-separated subject names input
            updatedCategory.subjectName = value.split(',').map(subject => subject.trim()); // Split input by commas and remove extra spaces 
          } else {
            updatedCategory[field] = value;
          }
          
          return { ...prevData, pyqsCategory: updatedCategory };
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
        pyqsCategory: {
          ...prevData.pyqsCategory,
          year: selectedYear,  // Store the selected year as a string
        },
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        if(isGhost) {
          const pyqsRef = await addDoc(collection(db, 'PYQs'), {
            ...formData,
            createdAt: serverTimestamp(),
            createdBy: user.displayName, // Correct this line if you have Firebase Auth setup
            adminId: user.uid
          });
          toast.success('PYQs added successfully!');

          await updateDoc(pyqsRef, {
            pyqsId: pyqsRef.id
          });

          setFormData({
            pyqsCategory: {
              academicYear: '',
              branch: [],
              institution: '',
              subjectName: [],
              year: '',
            },
            pyqsLink: '',
            pyqsTitle: '',
          })
        } else{
          toast('Unauthorized Access!', {icon: '🚫'})
        }
      } catch (error) {
        toast.error(`Oops! Couldn't add PYQs:  ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    return isGhost ? (
      <div className="mx-auto mt-7 ml-3 p-6 bg-white overflow-scroll flex flex-col justify-between text-gray-700">
        <form onSubmit={handleSubmit} className="flex flex-col w-3/4 gap-4 text-gray-500">
          {/* PYQS Title */}
          <div className="flex flex-col gap-2">
            <p className="text-lg text-left">PYQs Title</p>
            <input
              type="text"
              name="pyqsTitle"
              value={formData.pyqsTitle}
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
              name="pyqsCategory.academicYear"
              value={formData.pyqsCategory.academicYear}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Example: Dec 22"
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
                    name="pyqsCategory.branch"
                    value={branch}
                    checked={formData.pyqsCategory.branch.includes(branch)}
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
              name="pyqsCategory.institution"
              value={formData.pyqsCategory.institution}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Example: Mumbai University"
              required
            />
          </div>

          {/* Subject Name */}
          <div className='flex flex-col gap-2'>
            <p className="text-lg text-left">Subject Name (Comma Separated)</p>
            <input
              type="text"
              name="pyqsCategory.subjectName"
              value={formData.pyqsCategory.subjectName.join(', ')}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Example: Operating System, Data Structures"
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
                    checked={formData.pyqsCategory.year === year} // Check if the year is selected
                    onChange={handleYearChange} // Handle year change
                    className="accent-blue-600"
                  />
                  <span>{year}</span>
                </label>
              ))}
            </div>
          </div>

          {/* PYQS Link
          <div className='flex flex-col gap-2'>
            <p className="text-lg text-left">PYQs Link</p>
            <input
              type="url"
              name="pyqsLink"
              value={formData.pyqsLink}
              onChange={(e) => {
                const modifiedLink = e.target.value.replace(/\/view\?usp=drive_link$/, '/preview');
                setFormData({
                  ...formData,
                  pyqsLink: modifiedLink,
                });
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              placeholder='Enter GDrive PDF Link...'
            />
          </div> */}

          
          {/* PYQs Link */}
          <div className='flex flex-col gap-2'>
            <p className="text-lg text-left">PYQs Link</p>
            <input
              type="url"
              name="pyqsLink"
              value={formData.pyqsLink}
              onChange={(e) => {
                let modifiedLink = e.target.value;

                // Check if the link matches the Google Drive view URL pattern
                if (modifiedLink.includes("/view?usp=drive_link")) {
                  modifiedLink = modifiedLink.replace(/\/view\?usp=drive_link$/, '/preview');
                }
                
                setFormData({
                  ...formData,
                  pyqsLink: modifiedLink,
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
            {loading ? "Adding PYQs..." : "ADD PYQs"}
          </button>
        </form>
      </div>
    ) : <AccessForbidden />
  };

  export default AddPYQs;