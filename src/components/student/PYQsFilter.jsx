import React, { useContext, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { db, collection, query, where, getDocs } from "../../config/firebase";
import { branches, years, institutions, subjects, academicYears } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { usePersistentState } from '../../hooks/usePersistentState';

const animatedComponents = makeAnimated();

const PYQsFilter = ({ onResults }) => {
  const [filterMode, setFilterMode] = usePersistentState('pyqsFilterMode', 'subjectName');
  const [filters, setFilters] = usePersistentState('pyqsFilters', {
    branch: null,
    institution: null,
    year: null,
    subjectName: null,
    academicYear: null,
  });

  const { toast } = useContext(AppContext);

  const handleChange = (selectedOption, { name }) => {
    setFilters((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));
  };

  const handleToggle = () => {
    setFilterMode((prev) =>
      prev === "academicYear" ? "subjectName" : "academicYear"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onResults([]);
    toast.dismiss();
    toast.loading("Fetching PYQs...");

    try {
      let q = collection(db, "PYQs");
      const conditions = [];

      if (filterMode === "academicYear") {
        if (filters.academicYear && filters.academicYear.length > 0) {
          const academicYears = filters.academicYear.map((a) => a.value);
          conditions.push(where("pyqsCategory.academicYear", "in", academicYears));
        } else {
          toast.error("Please select Academic Year.");
          return;
        }
      } else if (filterMode === "subjectName") {
        if (filters.subjectName) {
          conditions.push(
            where("pyqsCategory.subjectName", "array-contains", filters.subjectName.value)
          );
        } else {
          toast.error("Please select Subject Name.");
          return;
        }
      }

      if (filters.branch && filters.branch.length > 0) {
        const selectedBranches = filters.branch.map((b) => b.value);
        conditions.push(where("pyqsCategory.branch", "array-contains-any", selectedBranches));
      }

      if (filters.institution) {
        conditions.push(where("pyqsCategory.institution", "==", filters.institution.value));
      }

      if (filters.year) {
        conditions.push(where("pyqsCategory.year", "==", filters.year.value));
      }

      if (conditions.length === 0) {
        toast.error("Please select at least one filter.");
        return;
      }

      q = query(q, ...conditions);
      const querySnapshot = await getDocs(q);
      const pyqs = [];
      querySnapshot.forEach((doc) => {
        pyqs.push({ id: doc.id, ...doc.data() });
      });

      onResults(pyqs);
      toast.dismiss();
      if (pyqs.length === 0) toast.error("No PYQs found!");
      else toast.success("PYQs loaded!");
    } catch (error) {
      console.error("Error fetching PYQs:", error);
      toast.dismiss();
      toast.error("Error fetching data!");
    }
  };


  const clearFilters = () => {
    setFilters({
      branch: null,
      institution: null,
      year: null,
      subjectName: null,
      academicYear: null,
    });
    // onResults([]);
    toast.dismiss();
    toast.success("Filters cleared!");
  };

  // Cleanup effect when component unmounts
  // useEffect(() => {
  //   return () => {
  //     // Optional: Clear filters when component unmounts
  //     // localStorage.removeItem('faqsFilters');
  //   };
  // }, []);

  return (
    <div className="bg-white border-2 border-indigo-500 p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter PYQs</h3>
        {/* <button
          onClick={clearFilters}
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Clear All
        </button> */}
        <button
          onClick={handleToggle}
          className="text-sm text-white hover:animate-pulse hover:bg-indigo-700 bg-indigo-500 rounded-full h-6 w-[50%]"
        >
          Filter by - {filterMode === "academicYear" ? "Subject Name" : "Academic Year"}
        </button>
      </div>

      <div className="space-y-4">
        {/* Branch - Only show for academicYear mode */}
        {filterMode === "academicYear" && (
          <div>
            <label className="block mb-1 font-medium">Branch</label>
            <Select
              closeMenuOnSelect={false}
              isMulti
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
        )}

        {/* Filter Mode Specific Fields */}
        {filterMode === "academicYear" ? (
          <div>
            <label className="block mb-1 font-medium">Academic Year</label>
            <Select
              isMulti
              name="academicYear"
              components={animatedComponents}
              closeMenuOnSelect={false}
              options={academicYears}
              placeholder="Select Academic Year(s)"
              value={filters.academicYear}
              onChange={handleChange}
              className="basic-single"
              classNamePrefix="select"
            />

          </div>
        ) : (
          <div>
            <label className="block mb-1 font-medium">Subject Name</label>
            <Select
              name="subjectName"
              isClearable={true}
              components={animatedComponents}
              options={subjects}
              placeholder="Start typing to find the Subject to select it..."
              value={filters.subjectName}
              onChange={handleChange}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
        )}

        {/* Institution */}
        <div>
          <label className="block mb-1 font-medium">Institution</label>
          <Select
            name="institution"
            isClearable={true}
            components={animatedComponents}
            options={institutions}
            placeholder="Select Institution"
            value={filters.institution}
            onChange={handleChange}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>

        {/* Year */}
        {filterMode === "academicYear" && (
          <div>
            <label className="block mb-1 font-medium">Year</label>
            <Select
              name="year"
              isClearable={true}
              components={animatedComponents}
              options={years}
              placeholder="Select Year"
              value={filters.year}
              onChange={handleChange}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
        )}

        <div className="flex space-x-2">

          <button
            type="button"
            onClick={clearFilters}
            className=" text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Clear
          </button>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className={`w-full py-2 rounded text-white ${(filterMode === "academicYear" &&
              (!filters.academicYear ||
                filters.academicYear.length === 0 ||
                !filters.branch ||
                filters.branch.length === 0 ||
                !filters.institution ||
                !filters.year))
              ||
              (filterMode === "subjectName" &&
                (!filters.subjectName || !filters.institution))
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
            disabled={
              (filterMode === "academicYear" &&
                (!filters.academicYear ||
                  filters.academicYear.length === 0 ||
                  !filters.branch ||
                  filters.branch.length === 0 ||
                  !filters.institution ||
                  !filters.year))
              ||
              (filterMode === "subjectName" &&
                (!filters.subjectName || !filters.institution))
            }
          >
            Apply Filters
          </button>
        </div>


      </div>
    </div>
  );
};

export default PYQsFilter;