import React, { useState } from 'react';
import { db, collection, addDoc, serverTimestamp, updateDoc } from "../../config/firebase";

const AddNotes = () => {
  const [formData, setFormData] = useState({
    notesCategory: {
      branch: [],
      subjectName: [],
      year: '',
    },
    notesLink: '',
    notesTitle: '',
    adminId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('notesCategory')) {
      const path = name.split('.'); // Split name into parts
      const field = path.pop(); // Get the last part (e.g., 'academicYear')

      setFormData(prevData => {
        const updatedCategory = { ...prevData.notesCategory };

        if (type === 'checkbox') {
          // Handling checkbox for branch
          if (name === 'notesCategory.branch') {
            if (checked) {
              updatedCategory.branch.push(value);
            } else {
              updatedCategory.branch = updatedCategory.branch.filter((item) => item !== value);
            }
          }
        } else if (name === 'notesCategory.subjectName') {
          // Handling comma-separated subject names input
          updatedCategory.subjectName = value.split(',').map(subject => subject.trim()); // Split input by commas and remove extra spaces
        } else {
          updatedCategory[field] = value;
        }

        return { ...prevData, notesCategory: updatedCategory };
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
      notesCategory: {
        ...prevData.notesCategory,
        year: selectedYear,  // Store the selected year as a string
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const notesRef = await addDoc(collection(db, 'Notes'), {
        ...formData,
        createdAt: serverTimestamp(),
        createdBy: 'auth.currentUser.displayName', // Correct this line if you have Firebase Auth setup
        adminId: 'req.auth.userId'
      });
      alert('Data submitted successfully!');

      await updateDoc(notesRef, {
        notesId: notesRef.id
      });

      setFormData({
        notesCategory: {
          branch: [],
          year: '',
          subjectName: []
        },
        notesLink: '',
        notesTitle: '',
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
        {/* Notes Title */}
        <div className="flex flex-col gap-2">
          <p className="text-lg text-left">Notes Title</p>
          <input
            type="text"
            name="notesTitle"
            value={formData.notesTitle}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
  
        {/* Subject Name */}
        <div className='flex flex-col gap-2'>
          <p className="text-lg text-left">Subject Name (Comma Separated)</p>
          <input
            type="text"
            name="notesCategory.subjectName"
            value={formData.notesCategory.subjectName.join(', ')} // Show array as comma-separated string
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Example: Operating System, Data Structures"
            required
          />
        </div>

        {/* Branch */}
        <div className='space-y-2 '>
          <p className="text-lg text-left">Branch</p>
          <div className="flex flex-col gap-2 text-left">
            {["Computer Engineering", "Information Technology", "Electronics & Telecommunication", "Artificial Intelligence & Data Science", "Electronics & Computer Science"].map((branch) => (
              <label key={branch} className='flex items-center gap-2 hover:text-amber-400'>
                <input
                  type="checkbox"
                  name="notesCategory.branch"
                  value={branch}
                  checked={formData.notesCategory.branch.includes(branch)}
                  onChange={handleChange}
                  className="mr-2 hover:text-amber-400"
                />
                <span>{branch}</span>
              </label>
            ))}
          </div>
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
                  checked={formData.notesCategory.year === year} // Check if the year is selected
                  onChange={handleYearChange} // Handle year change
                  className="accent-blue-600"
                />
                <span>{year}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes Link */}
        <div className='flex flex-col gap-2'>
          <p className="text-lg text-left">Notes Link</p>
          <input
            type="url"
            name="notesLink"
            value={formData.notesLink}
            onChange={(e) => {
              const modifiedLink = e.target.value.replace(/\/view\?usp=drive_link$/, '/preview');
              setFormData({
                ...formData,
                notesLink: modifiedLink,
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
          {loading ? "Adding Notes..." : "ADD NOTES"}
        </button>
      </form>
    </div>
  );
};

export default AddNotes;
