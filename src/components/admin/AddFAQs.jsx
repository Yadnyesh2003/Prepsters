import React, { useContext, useState } from 'react';
import { db, collection, addDoc, serverTimestamp, updateDoc } from "../../config/firebase";
import Select from 'react-select';
import makeAnimated from "react-select/animated";
import { useAuth } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import { branches, institutions, years, subjects, contributors } from '../../assets/assets';
import AccessForbidden from '../student/AccessForbidden';

const AddFAQs = () => {
  const [formData, setFormData] = useState({
    faqsCategory: {
      branch: [], 
      institution: null,
      subjectName: null,
      year: null,
    },
    faqsLink: '',
    faqsTitle: '',
    contributorName: null,
    adminId: ''
  });

  const animatedComponents = makeAnimated();
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if(isGhost) {
        const faqsRef = await addDoc(collection(db, 'FAQs'), {
          faqsCategory: {
            branch: formData.faqsCategory.branch.map(b => b.value),
            subjectName: formData.faqsCategory.subjectName?.value || '',
            institution: formData.faqsCategory.institution?.value || '',
            year: formData.faqsCategory.year?.value || '',
          },
          faqsTitle: formData.faqsTitle,
          faqsLink: formData.faqsLink,
          contributorName: formData.contributorName?.value || '',
          adminId: user.uid,
          createdBy: user.displayName,
          createdAt: serverTimestamp(),
        });        
        toast.success('Added FAQs successfully!');

        await updateDoc(faqsRef, {
          faqsId: faqsRef.id
        });

        setFormData({
          faqsCategory: {
            branch: [],
            institution: null,
            year: null,
            subjectName: null,
          },
          faqsLink: '',
          contributorName: null,
          faqsTitle: '',
        });        
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
        <div className="flex flex-col gap-2">
        <p className="text-lg text-left">Branch</p>
        <Select
          isMulti
          closeMenuOnSelect={false}
          required
          components={animatedComponents}
          options={branches}
          value={formData.faqsCategory.branch}
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              faqsCategory: {
                ...prev.faqsCategory,
                branch: selected,
              },
            }))
          }
          className="text-black"
          placeholder="Select branches"
        />
      </div>

  
        {/* Subject Name */}
        <div className="flex flex-col gap-2">
        <p className="text-lg text-left">Subject Name</p>
        <Select
          options={subjects}
          required
          components={animatedComponents}
          isClearable={true}
          value={formData.faqsCategory.subjectName}
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              faqsCategory: {
                ...prev.faqsCategory,
                subjectName: selected,
              },
            }))
          }
          className="text-black"
          placeholder="Select subject"
        />
      </div>

      {/* Instituition */}
      <div className="flex flex-col gap-2">
      <p className="text-lg text-left">Institution</p>
      <Select
        options={institutions}
        isClearable={true}
        required
        components={animatedComponents}
        value={formData.faqsCategory.institution}
        onChange={(selected) =>
          setFormData((prev) => ({
            ...prev,
            faqsCategory: {
              ...prev.faqsCategory,
              institution: selected,
            },
          }))
        }
        className="text-black"
        placeholder="Select institution"
      />
    </div>

      {/* Year  */}
      <div className="flex flex-col gap-2">
        <p className="text-lg text-left">Year</p>
        <Select
          options={years}
          isClearable={true}
          required
          components={animatedComponents}
          value={formData.faqsCategory.year}
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              faqsCategory: {
                ...prev.faqsCategory,
                year: selected,
              },
            }))
          }
          className="text-black"
          placeholder="Select year"
        />
      </div>

       {/* Contributor Name */}
      <div className="flex flex-col gap-2">
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