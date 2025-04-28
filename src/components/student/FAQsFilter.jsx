import React, { useContext, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { db, collection, query, where, getDocs } from "../../config/firebase";
import { branches, years, institutions, subjects, contributors } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const animatedComponents = makeAnimated();

const FAQsFilter = ({ onResults }) => {
  const [filters, setFilters] = useState({
    branch: null,
    institution: null,
    year: null,
    subjectName: null,
    contributorName: null,
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

      if (filters.branch && filters.branch.length > 0) {
        const selectedBranches = filters.branch.map((b) => b.value);
        conditions.push(
          where("faqsCategory.branch", "array-contains-any", selectedBranches)
        );
      }
      if (filters.contributorName) {
        conditions.push(where("contributorName", "==", filters.contributorName.value));
      }
      if (filters.institution) {
        conditions.push(where("faqsCategory.institution", "==", filters.institution.value));
      }
      if (filters.subjectName) {
        conditions.push(where("faqsCategory.subjectName", "==", filters.subjectName.value));
      }
      if (filters.year) {
        conditions.push(where("faqsCategory.year", "==", filters.year.value));
      }

      if (conditions.length === 0) {
        toast.error("Please select at least one filter option.");
        return;
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Filter FAQs</h3>
      <div className="space-y-4">

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

        <div>
          <label className="block mb-1 font-medium">Contributor</label>
          <Select
            name="contributorName"
            isClearable={true}
            components={animatedComponents}
            options={contributors}
            placeholder="Select Contributor"
            value={filters.contributorName}
            onChange={handleChange}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>

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

        <div>
          <label className="block mb-1 font-medium">Subject</label>
          <Select
            name="subjectName"
            isClearable={true}
            components={animatedComponents}
            options={subjects}
            placeholder="Select Subject"
            value={filters.subjectName}
            onChange={handleChange}
            className="basic-single"
            classNamePrefix="select"
          />
        </div>

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

        <button
          disabled={
            !filters.branch &&
            !filters.contributorName &&
            !filters.institution &&
            !filters.subjectName &&
            !filters.year
          }
          onClick={handleSubmit}
          className={`w-full py-2 rounded text-white ${
            !filters.branch &&
            !filters.contributorName &&
            !filters.institution &&
            !filters.subjectName &&
            !filters.year
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FAQsFilter;
