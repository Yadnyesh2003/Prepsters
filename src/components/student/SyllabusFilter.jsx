import React, { useContext, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { db, collection, query, where, getDocs } from "../../config/firebase";
import { branches, years, institutions } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { usePersistentState } from '../../hooks/usePersistentState';

const animatedComponents = makeAnimated();

const SyllabusFilter = ({ onResults }) => {
  const [filters, setFilters, clearFilters] = usePersistentState('syllabusFilters', {
    branch: null,
    institution: null,
    year: null,
  });

  const { toast, trackFilterEvent } = useContext(AppContext);

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
    toast.loading("Fetching syllabus...");

    try {
      let q = collection(db, "Syllabus");
      const conditions = [];

      //For Google Analytics
      const selectedBranch = filters.branch?.value || "not_selected";
      const selectedInstitution = filters.institution?.value || "not_selected";
      const selectedYear = filters.year?.value || "not_selected";

      if (filters.branch) {
        conditions.push(where("syllabusCategory.branch", "==", filters.branch.value));
      }
      if (filters.institution) {
        conditions.push(where("syllabusCategory.institution", "==", filters.institution.value));
      }
      if (filters.year) {
        conditions.push(where("syllabusCategory.year", "==", filters.year.value));
      }

      if (conditions.length === 0) {
        toast.error("Please select at least one filter option.");
        return;
      }

      q = query(q, ...conditions);
      const querySnapshot = await getDocs(q);
      const syllabus = [];
      querySnapshot.forEach((doc) => {
        syllabus.push({ id: doc.id, ...doc.data() });
      });

      onResults(syllabus);
      toast.dismiss();
      if (syllabus.length === 0) toast.error("No syllabus found!");
      else toast.success(`${syllabus.length} syllabus items loaded!`);

      //Google Analytics logEvent
      trackFilterEvent({
        contentType: "Syllabus",
        filters: {
          filtered_branch: selectedBranch,
          filtered_institution: selectedInstitution,
          filtered_year: selectedYear,
        },
      });

    } catch (error) {
      console.error("Error fetching syllabus:", error);
      toast.dismiss();
      toast.error("Error fetching data!");
    }
  };

  const handleClearFilters = () => {
    setFilters({
      branch: null,
      institution: null,
      year: null,
    });
    // onResults([]);
    toast.dismiss();
    toast.success("Filters cleared!");
  };

  // Cleanup effect for handling tab/window closing
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('syllabusFilters');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Syllabus</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Branch</label>
          <Select
            name="branch"
            isClearable={true}
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

        <div className="flex space-x-2">
          <button
            disabled={
              !filters.branch &&
              !filters.institution &&
              !filters.year
            }
            onClick={handleSubmit}
            className={`flex-1 py-2 rounded text-white ${!filters.branch &&
              !filters.institution &&
              !filters.year
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyllabusFilter;