import React, { useContext, useState } from 'react';
import Select from 'react-select';
import { AppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { db, collection, addDoc, serverTimestamp, updateDoc } from "../../config/firebase";
import AccessForbidden from '../student/AccessForbidden';
import { branches, institutions, years } from '../../assets/assets';

const AddSyllabus = () => {
  const [formData, setFormData] = useState({
    syllabusCategory: {
      academicYear: '',
      branch: null,
      institution: null,
      year: null,
    },
    syllabusLink: '',
    syllabusTitle: '',
    adminId: ''
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useContext(AppContext);
  const { isGhost, user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('syllabusCategory')) {
      const path = name.split('.');
      const field = path[1];

      setFormData(prev => ({
        ...prev,
        syllabusCategory: {
          ...prev.syllabusCategory,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData(prev => ({
      ...prev,
      syllabusCategory: {
        ...prev.syllabusCategory,
        [name]: selectedOption,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isGhost) {
        const formattedData = {
          ...formData,
          syllabusCategory: {
            academicYear: formData.syllabusCategory.academicYear,
            branch: formData.syllabusCategory.branch?.value || '',
            institution: formData.syllabusCategory.institution?.value || '',
            year: formData.syllabusCategory.year?.value || '',
          },
          adminId: user.uid,
          createdBy: user.displayName,
          createdAt: serverTimestamp(),
        };

        const syllabusRef = await addDoc(collection(db, 'Syllabus'), formattedData);

        toast.success('Syllabus added successfully!');

        await updateDoc(syllabusRef, {
          syllabusId: syllabusRef.id
        });

        // Reset form
        setFormData({
          syllabusCategory: {
            academicYear: '',
            branch: null,
            institution: null,
            year: null,
          },
          syllabusLink: '',
          syllabusTitle: '',
          adminId: ''
        });

      } else {
        toast('Unauthorized Access!', { icon: '🚫' });
      }
    } catch (error) {
      toast.error(`Oops! Couldn't add Syllabus: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return isGhost ? (
    <div className="mx-auto mt-7 ml-3 p-6 bg-white overflow-scroll flex flex-col justify-between text-gray-700">
      <form onSubmit={handleSubmit} className="flex flex-col w-3/4 gap-4 text-gray-500">
        {/* Syllabus Title */}
        <div className="flex flex-col gap-2">
          <p className="text-lg text-left">Syllabus Title</p>
          <input
            type="text"
            name="syllabusTitle"
            value={formData.syllabusTitle}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Example: 2022-2023"
            required
          />
        </div>

        {/* Branch Dropdown */}
        <div className="flex flex-col gap-2">
          <p className="text-lg text-left">Branch</p>
          <Select
            name="branch"
            isClearable={true}
            options={branches}
            required
            value={formData.syllabusCategory.branch}
            onChange={handleSelectChange}
            placeholder="Select Branch..."
            className="text-black"
          />
        </div>

        {/* Institution Dropdown */}
        <div className="flex flex-col gap-2">
          <p className="text-lg text-left">Institution</p>
          <Select
            name="institution"
            isClearable={true}
            options={institutions}
            required
            value={formData.syllabusCategory.institution}
            onChange={handleSelectChange}
            placeholder="Select Institution..."
            className="text-black"
          />
        </div>

        {/* Year Dropdown */}
        <div className="flex flex-col gap-2">
          <p className="text-lg text-left">Year</p>
          <Select
            name="year"
            isClearable={true}
            options={years}
            required
            value={formData.syllabusCategory.year}
            onChange={handleSelectChange}
            placeholder="Select Year..."
            className="text-black"
          />
        </div>

        {/* Syllabus Link */}
        <div className="flex flex-col gap-2">
          <p className="text-lg text-left">Syllabus Link</p>
          <input
            type="url"
            name="syllabusLink"
            value={formData.syllabusLink}
            onChange={(e) => {
              const modifiedLink = e.target.value.replace(/\/view\?usp=drive_link$/, '/preview');
              setFormData({
                ...formData,
                syllabusLink: modifiedLink,
              });
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter GDrive PDF Link..."
            required
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
  ) : <AccessForbidden />;
};

export default AddSyllabus;
