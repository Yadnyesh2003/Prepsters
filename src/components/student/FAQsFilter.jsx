import React, { useContext, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { db, collection, query, where, getDocs } from "../../config/firebase";
import { branches, years, institutions, subjects, contributors } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { usePersistentState } from '../../hooks/usePersistentState';

const animatedComponents = makeAnimated();

const allContributorsOption = { value: "ALL_CONTRIBUTORS", label: "All Contributors" };
const contributorOptions = [allContributorsOption, ...contributors];

const FAQsFilter = ({ onResults }) => {
  const [filterMode, setFilterMode] = useState("subjectName");
  const [filters, setFilters] = usePersistentState('faqsFilters', {
    branch: [],
    institution: null,
    year: null,
    subjectName: null,
    contributorName: [],
  });

  const { toast } = useContext(AppContext);

  const handleChange = (selectedOption, { name }) => {
    const value = name === "branch" || name === "contributorName"
      ? (selectedOption || []).map(opt => opt.value)
      : selectedOption ? selectedOption.value : null;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    toast.loading("Fetching FAQs...");

    if (
      (filterMode === "subjectName" &&
        (!filters.subjectName || !filters.institution || (filters.contributorName || []).length === 0)) ||
      (filterMode === "branch" &&
        (!filters.branch || filters.branch.length === 0 || !filters.institution || !filters.year))
    ) {
      toast.dismiss();
      toast.error("Please select all required filter options.");
      return;
    }

    try {
      let q = collection(db, "FAQs");
      const conditions = [];

      if (filterMode === "subjectName") {
        if (!filters.subjectName) {
          toast.dismiss();
          toast.error("Please select a Subject.");
          return;
        }
        if (!filters.institution) {
          toast.dismiss();
          toast.error("Please select an Institution.");
          return;
        }
        if ((filters.contributorName || []).length === 0) {
          toast.dismiss();
          toast.error("Please select at least one Contributor.");
          return;
        }
        conditions.push(where("faqsCategory.subjectName", "==", filters.subjectName));
        conditions.push(where("faqsCategory.institution", "==", filters.institution));
        conditions.push(where("contributorName", "in", filters.contributorName));
      } else if (filterMode === "branch") {
        if (!filters.branch || filters.branch.length === 0) {
          toast.dismiss();
          toast.error("Please select at least one Branch.");
          return;
        }
        if (!filters.institution) {
          toast.dismiss();
          toast.error("Please select an Institution.");
          return;
        }
        if (!filters.year) {
          toast.dismiss();
          toast.error("Please select a Year.");
          return;
        }
        conditions.push(where("faqsCategory.branch", "array-contains-any", filters.branch));
        conditions.push(where("faqsCategory.institution", "==", filters.institution));
        conditions.push(where("faqsCategory.year", "==", filters.year));
      }

      q = query(q, ...conditions);
      const querySnapshot = await getDocs(q);
      const faqs = [];
      querySnapshot.forEach((doc) => {
        faqs.push({ id: doc.id, ...doc.data() });
      });

      onResults(faqs);
      toast.dismiss();
      if (faqs.length === 0) {
        toast.error("No FAQs found!");
      } else {
        toast.success("FAQs loaded!");
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.dismiss();
      toast.error("Error fetching data!");
    }
  };

  const clearFilters = () => {
    setFilters({
      branch: [],
      institution: null,
      year: null,
      subjectName: null,
      contributorName: [],
    });
    // onResults([]);
    toast.dismiss();
    toast.success("Filters cleared!");
  };

  const isApplyDisabled =
    (filterMode === "subjectName" &&
      (!filters.subjectName || !filters.institution || (filters.contributorName || []).length === 0)) ||
    (filterMode === "branch" &&
      (!filters.branch || filters.branch.length === 0 || !filters.institution || !filters.year));

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter FAQs</h3>
        <button
          type="button"
          onClick={() => setFilterMode((prev) => (prev === "subjectName" ? "branch" : "subjectName"))}
          className="text-sm text-white hover:animate-pulse hover:bg-indigo-700 bg-indigo-500 rounded-full h-6 px-3"
        >
          Filter by - {filterMode === "subjectName" ? "Branch" : "Subject Name"}
        </button>
      </div>

      {filterMode === "subjectName" ? (
        <>
          {/* Subject */}
          <div>
            <label className="block mb-1 font-medium">Subject</label>
            <Select
              name="subjectName"
              isClearable
              components={animatedComponents}
              options={subjects}
              placeholder="Select Subject"
              value={subjects.find(opt => opt.value === filters.subjectName) || null}
              onChange={(option, action) => handleChange(option, action)}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block mb-1 font-medium">Institution</label>
            <Select
              name="institution"
              isClearable
              components={animatedComponents}
              options={institutions}
              placeholder="Select Institution"
              value={institutions.find(opt => opt.value === filters.institution) || null}
              onChange={(option, action) => handleChange(option, action)}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>

          {/* Contributor */}
          <div>
            <label className="block mb-1 font-medium">Contributor Name</label>
            <Select
              isMulti
              name="contributorName"
              components={animatedComponents}
              options={contributorOptions}
              closeMenuOnSelect={false}
              placeholder="Select Contributors"
              className="basic-multi-select"
              classNamePrefix="select"
              value={
                (filters.contributorName || []).length === contributors.length
                  ? [allContributorsOption]
                  : (filters.contributorName || []).map(val => contributors.find(c => c.value === val) || { value: val, label: val })
              }
              onChange={(selected) => {
                if (!selected || selected.length === 0) {
                  setFilters((prev) => ({ ...prev, contributorName: [] }));
                  return;
                }
                const selectedValues = selected.map(s => s.value);
                if (selectedValues.includes("ALL_CONTRIBUTORS")) {
                  setFilters((prev) => ({
                    ...prev,
                    contributorName: contributors.map(c => c.value),
                  }));
                } else {
                  setFilters((prev) => ({
                    ...prev,
                    contributorName: selectedValues,
                  }));
                }
              }}
            />
            {(filters.contributorName || []).length === contributors.length && (
              <p className="text-sm text-gray-500 mt-1">(All Contributors Selected)</p>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Branch */}
          <div>
            <label className="block mb-1 font-medium">Branch</label>
            <Select
              closeMenuOnSelect={false}
              isMulti
              name="branch"
              components={animatedComponents}
              options={branches}
              placeholder="Select Branches"
              value={branches.filter(opt => (filters.branch || []).includes(opt.value))}
              onChange={(option, action) => handleChange(option, action)}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block mb-1 font-medium">Institution</label>
            <Select
              name="institution"
              isClearable
              components={animatedComponents}
              options={institutions}
              placeholder="Select Institution"
              value={institutions.find(opt => opt.value === filters.institution) || null}
              onChange={(option, action) => handleChange(option, action)}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block mb-1 font-medium">Year</label>
            <Select
              name="year"
              isClearable
              components={animatedComponents}
              options={years}
              placeholder="Select Year"
              value={years.find(opt => opt.value === filters.year) || null}
              onChange={(option, action) => handleChange(option, action)}
              className="basic-single"
              classNamePrefix="select"
            />
          </div>
        </>
      )}

      <div className="flex space-x-2">
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={isApplyDisabled}
          className={`w-full py-2 rounded text-white ${isApplyDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default FAQsFilter;