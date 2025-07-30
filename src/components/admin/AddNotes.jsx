import React, { useContext, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, collection, addDoc, serverTimestamp, updateDoc } from "../../config/firebase";
import Select from 'react-select';
import makeAnimated from "react-select/animated";
import { subjects, branches, years, contributors } from '../../assets/assets'; // assuming these exist
import { AppContext } from '../../context/AppContext';
import AccessForbidden from '../student/AccessForbidden';

const AddNotes = () => {
  const [formData, setFormData] = useState({
    notesCategory: {
      branch: [],
      subjectName: [],
      year: null,
    },
    notesLink: '',
    notesTitle: '',
    contributorName: null,
    adminId: ''
  });
  const [loading, setLoading] = useState(false);

  const { toast } = useContext(AppContext);
  const animatedComponents = makeAnimated();
  const { isGhost, user } = useAuth();

  useEffect(()=>{
    document.title = "Add Notes"
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if(isGhost){
        const notesRef = await addDoc(collection(db, 'Notes'), {
          notesCategory: {
            subjectName: formData.notesCategory.subjectName?.map(s => s.value),
            branch: formData.notesCategory.branch?.map(b => b.value),
            year: formData.notesCategory.year?.value || '',
          },
          notesLink: formData.notesLink,
          notesTitle: formData.notesTitle,
          contributorName: formData.contributorName?.value || '',
          adminId: user.uid,
          createdBy: user.displayName,
          createdAt: serverTimestamp(),
        });
        toast.success('Notes added successfully!');

        await updateDoc(notesRef, {
          notesId: notesRef.id
        });

        setFormData({
          notesCategory: {
            branch: [],
            year: null,
            subjectName: []
          },
          notesLink: '',
          contributorName: null,
          notesTitle: '',
        })
      } else{
        toast('Unauthorized Access!', {icon: '🚫'})
      }
    } catch (error) {
      toast.error(`Oops! Couldn't add notes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return isGhost ? (
    <div className="mx-auto mt-7 ml-3 p-6 bg-white overflow-scroll flex flex-col justify-between text-gray-700">
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
          <p className="text-lg text-left">Subject Name</p>
          <Select
            isMulti
            closeMenuOnSelect={false}
            required
            components={animatedComponents}
            options={subjects}
            value={formData.notesCategory.subjectName}
            onChange={(selected) =>
              setFormData((prev) => ({
                ...prev,
                notesCategory: {
                  ...prev.notesCategory,
                  subjectName: selected,
                },
              }))
            }
            className="text-black"
            placeholder="Select subjects"
          />
        </div>

        {/* Branch */}
        <div className='space-y-2 '>
          <p className="text-lg text-left">Branch</p>
          <Select
            isMulti
            closeMenuOnSelect={false}
            required
            components={animatedComponents}
            options={branches}
            value={formData.notesCategory.branch}
            onChange={(selected) =>
              setFormData((prev) => ({
                ...prev,
                notesCategory: {
                  ...prev.notesCategory,
                  branch: selected,
                },
              }))
            }
            className="text-black"
            placeholder="Select branches"
          />
        </div>

        {/* Year  */}
        <div className="space-y-2">
          <p className="text-lg text-left">Year</p>
          <Select
            isClearable
            required
            components={animatedComponents}
            options={years}
            value={formData.notesCategory.year}
            onChange={(selected) =>
              setFormData((prev) => ({
                ...prev,
                notesCategory: {
                  ...prev.notesCategory,
                  year: selected,
                },
              }))
            }
            className="text-black"
            placeholder="Select year"
          />
        </div>

       {/* Contributor Name */}
        <div className='flex flex-col gap-2'>
          <p className="text-lg text-left">Contributor Name</p>
          <Select
            isClearable
            required
            components={animatedComponents}
            options={contributors}
            value={formData.contributorName}
            onChange={(selected) =>
              setFormData((prev) => ({
                ...prev,
                contributorName: selected,
              }))
            }
            className="text-black"
            placeholder="Select contributor"
          />
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
  ) : <AccessForbidden/>
};

export default AddNotes;
