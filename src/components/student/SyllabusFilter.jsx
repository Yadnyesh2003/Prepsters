import React, { useContext, useState } from 'react'
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { db, collection, query, where, getDocs } from "../../config/firebase";
import { branches, years, institutions } from "../../assets/assets";
import { AppContext } from '../../context/AppContext';

const animatedComponents = makeAnimated();


const SyllabusFilter = ({ onResults }) => {
  const [filters, setFilters] = useState({
    branch: null,
    institution: null,
    year: null,
  });

  const handleChange = (selectedOption, { name }) => {
    setFilters((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));
  };

  
  const { toast } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onResults([]);
    toast.dismiss(); // dismiss any previous toasts
    toast.loading("Fetching data...");
    try {
      let q = collection(db, "Syllabus");
      const conditions = [];
      if (filters.branch) {
        conditions.push(where("syllabusCategory.branch", "==", filters.branch.value));
      }
      if (filters.institution) {
        conditions.push(where("syllabusCategory.institution", "==", filters.institution.value));
      }
      if (filters.year) {
        conditions.push(where("syllabusCategory.year", "==", filters.year.value));
      }

      // Apply conditions to query
      q = query(q, ...conditions);

      const querySnapshot = await getDocs(q);
      const syllabus = [];
      querySnapshot.forEach((doc) => {
        syllabus.push({ id: doc.id, ...doc.data() });
      });

      if (!filters.branch && !filters.institution && !filters.year) {
        toast.error("Please select at least one filter option.");
        return;
      }

      onResults(syllabus);
      toast.dismiss();
      if (syllabus.length === 0) toast.error("No data found!");
      else toast.success("Syllabus data loaded!");
    } catch (error) {
      toast.dismiss();
      toast.error("Error fetching data!");
    }
  };

  return (
  <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
    <h3 className="text-lg font-semibold mb-4">Filter Syllabus</h3>
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Branch</label>
        <Select
          name="branch"
          components={animatedComponents}
          options={branches}
          placeholder="Select Branch"
          value={filters.branch}
          onChange={handleChange}
          className="basic-single"
          classNamePrefix="select"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Institution</label>
        <Select
          name="institution"
          components={animatedComponents}
          options={institutions}
          placeholder="Select Institution"
          value={filters.institution}
          onChange={handleChange}
          className="basic-single"
          classNamePrefix="select"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Year</label>
        <Select
          name="year"
          components={animatedComponents}
          options={years}
          placeholder="Select Year"
          value={filters.year}
          onChange={handleChange}
          className="basic-single"
          classNamePrefix="select"
        />
      </div>

      <button
        disabled={!filters.branch && !filters.institution && !filters.year}
        onClick={handleSubmit}
        className={`w-full py-2 rounded text-white ${
          !filters.branch && !filters.institution && !filters.year
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      
      >
        Apply Filters
      </button>
    </div>
  </div>

  );
};

export default SyllabusFilter;
