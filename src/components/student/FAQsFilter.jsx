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
  const [filterMode, setFilterMode] = useState("subjectName"); // 'subjectName' or 'branch'
  const [filters, setFilters] = usePersistentState('faqsFilters', {
    branch: null,
    institution: null,
    year: null,
    subjectName: null,
    contributorName: [],
    contributorName: [],
  });

  const { toast } = useContext(AppContext);

  const handleChange = (selectedOption, { name }) => {
    setFilters((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onResults([]);
    toast.dismiss();
    toast.loading("Fetching FAQs...");

    try {
      let q = collection(db, "FAQs");
      const conditions = [];

      if (filterMode === "subjectName") {
        conditions.push(where("faqsCategory.subjectName", "==", filters.subjectName.value));
        conditions.push(where("faqsCategory.institution", "==", filters.institution.value));
        conditions.push(where("contributorName", "in", filters.contributorName));
      } else if (filterMode === "branch") {
        const selectedBranches = filters.branch.map((b) => b.value);
        conditions.push(where("faqsCategory.branch", "array-contains-any", selectedBranches));
        conditions.push(where("faqsCategory.institution", "==", filters.institution.value));
        conditions.push(where("faqsCategory.year", "==", filters.year.value));
      }

      q = query(q, ...conditions);
      const querySnapshot = await getDocs(q);
      const faqs = [];
      querySnapshot.forEach((doc) => {
        faqs.push({ id: doc.id, ...doc.data() });
      });

      onResults(faqs);
      toast.dismiss();
      if (faqs.length === 0) toast.error("No FAQs found!");
      else toast.success("FAQs loaded!");
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.dismiss();
      toast.error("Error fetching data!");
    }
  };

  const isApplyDisabled =
    (filterMode === "subjectName" &&
      (!filters.subjectName || !filters.institution || filters.contributorName.length === 0)) ||
    (filterMode === "branch" &&
      (!filters.branch || filters.branch.length === 0 || !filters.institution || !filters.year));

  const clearFilters = () => {
    setFilters({
      branch: null,
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
      (!filters.subjectName || !filters.institution || filters.contributorName.length === 0)) ||
    (filterMode === "branch" &&
      (!filters.branch || filters.branch.length === 0 || !filters.institution || !filters.year));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
                value={filters.subjectName}
                onChange={handleChange}
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
                value={filters.institution}
                onChange={handleChange}
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
                  filters.contributorName.length === contributors.length
                    ? [allContributorsOption]
                    : filters.contributorName.map((val) => ({ value: val, label: val }))
                }
                onChange={(selected) => {
                  if (!selected || selected.length === 0) {
                    setFilters((prev) => ({ ...prev, contributorName: [] }));
                    return;
                  }
                  const selectedValues = selected.map((s) => s.value);
                  if (selectedValues.includes("ALL_CONTRIBUTORS")) {
                    setFilters((prev) => ({
                      ...prev,
                      contributorName: contributors.map((c) => c.value),
                    }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      contributorName: selectedValues,
                    }));
                  }
                }}
              />
              {filters.contributorName.length === contributors.length && (
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
                value={filters.branch}
                onChange={handleChange}
                className="basic-single"
                classNamePrefix="select"
              />
            </div>
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
                value={filters.subjectName}
                onChange={handleChange}
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
                value={filters.institution}
                onChange={handleChange}
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
                  filters.contributorName.length === contributors.length
                    ? [allContributorsOption]
                    : filters.contributorName.map((val) => ({ value: val, label: val }))
                }
                onChange={(selected) => {
                  if (!selected || selected.length === 0) {
                    setFilters((prev) => ({ ...prev, contributorName: [] }));
                    return;
                  }
                  const selectedValues = selected.map((s) => s.value);
                  if (selectedValues.includes("ALL_CONTRIBUTORS")) {
                    setFilters((prev) => ({
                      ...prev,
                      contributorName: contributors.map((c) => c.value),
                    }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      contributorName: selectedValues,
                    }));
                  }
                }}
              />
              {filters.contributorName.length === contributors.length && (
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
                value={filters.branch}
                onChange={handleChange}
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
                value={filters.institution}
                onChange={handleChange}
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
                value={filters.year}
                onChange={handleChange}
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
            className=" text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isApplyDisabled}
            className={`w-full py-2 rounded text-white ${isApplyDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FAQsFilter;