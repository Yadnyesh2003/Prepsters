import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { db, collection, addDoc, serverTimestamp, updateDoc } from "../../config/firebase";
import Select from 'react-select';
import makeAnimated from "react-select/animated";
import { useAuth } from '../../context/AuthContext';
import AccessForbidden from '../student/AccessForbidden';
import { branches, years, academicYears, contributors, institutions, subjects } from '../../assets/assets';

  const AddPYQs = () => {
    const [formData, setFormData] = useState({
      pyqsCategory: {
        academicYear: null,
        branch: [],
        institution: null,
        subjectName: [],
        year: null,
      },
      pyqsLink: '',
      pyqsTitle: '',
      contributorName: null,
      adminId: ''
    });
    const [loading, setLoading] = useState(false);

    const { toast } = useContext(AppContext);
    const animatedComponents = makeAnimated();
    const { isGhost, user } = useAuth();

    useEffect(()=>{
      document.title = "Add PYQs"
    },[])

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

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        if(isGhost) {
          const pyqsRef = await addDoc(collection(db, 'PYQs'), {
            pyqsCategory: {
              academicYear: formData.pyqsCategory.academicYear?.value || '',
              branch: formData.pyqsCategory.branch?.map(b => b.value),
              institution: formData.pyqsCategory.institution?.value || '',
              subjectName: formData.pyqsCategory.subjectName?.map(s => s.value),
              year: formData.pyqsCategory.year?.value || '',
            },
            pyqsTitle: formData.pyqsTitle,
            pyqsLink: formData.pyqsLink,
            contributorName: formData.contributorName?.value || '',
            adminId: user.uid,
            createdBy: user.displayName,
            createdAt: serverTimestamp(),
          });          
          toast.success('PYQs added successfully!');

          await updateDoc(pyqsRef, {
            pyqsId: pyqsRef.id
          });

          setFormData({
            pyqsCategory: {
              academicYear: null,
              branch: [],
              institution: null,
              subjectName: [],
              year: null,
            },
            pyqsLink: '',
            pyqsTitle: '',
            contributorName: null,
          });          
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

          {/* Contributor Name */}
          <div className='flex flex-col gap-2'>
            <p className="text-lg text-left">Contributor Name</p>
            <Select
              options={contributors}
              isClearable={true}
              required
              components={animatedComponents}
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

          {/* Academic Year */}
          <div className="flex flex-col gap-2">
            <p className="text-lg text-left">Academic Year</p>
            <Select
              options={academicYears}
              isClearable={true}
              required
              components={animatedComponents}
              value={formData.pyqsCategory.academicYear}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  pyqsCategory: {
                    ...prev.pyqsCategory,
                    academicYear: selected,
                  },
                }))
              }
              className="text-black"
              placeholder="Select Academic Year"
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
              value={formData.pyqsCategory.branch}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  pyqsCategory: {
                    ...prev.pyqsCategory,
                    branch: selected,
                  },
                }))
              }
              className="text-black"
              placeholder="Select branches"
            />
          </div>

          {/* Institution */}
          <div className='flex flex-col gap-2'>
            <p className="text-lg text-left">Institution</p>
            <Select
              options={institutions}
              isClearable={true}
              required
              components={animatedComponents}
              value={formData.pyqsCategory.institution}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  pyqsCategory: {
                    ...prev.pyqsCategory,
                    institution: selected,
                  },
                }))
              }
              className="text-black"
              placeholder="Select institution"
            />
          </div>

          {/* Subject Name */}
          <div className='flex flex-col gap-2'>
            <p className="text-lg text-left">Subject Name</p>
            <Select
              isMulti
              closeMenuOnSelect={false}
              components={animatedComponents}
              options={subjects} // import this from assets
              value={formData.pyqsCategory.subjectName}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  pyqsCategory: {
                    ...prev.pyqsCategory,
                    subjectName: selected,
                  },
                }))
              }
              className="text-black"
              placeholder="Select subjects"
            />
          </div>

          {/* Year  */}
          <div className="space-y-2">
            <p className="text-lg text-left">Year</p>
            <Select
              name="year"
              isClearable={true}
              options={years}
              required
              value={formData.pyqsCategory.year}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  pyqsCategory: {
                    ...prev.pyqsCategory,
                    year: selected,
                  },
                }))
              }
              placeholder="Select Year"
              className="text-black"
            />
          </div>

          
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