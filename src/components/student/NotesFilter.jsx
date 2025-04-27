import { useContext, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { db, collection, query, where, getDocs } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { branches, years, subjects } from "../../assets/assets";

const animatedComponents = makeAnimated();

const NotesFilter = ({ onResults }) => {
  const [filters, setFilters] = useState({
    branch: [],
    subjectName: [],
    year: null,
  });

  const { toast } = useContext(AppContext);

  const handleBranchChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setFilters((prev) => ({ ...prev, branch: selectedValues }));
  };

  // const handleSubjectChange = (selectedOption) => {
  //   setFilters((prev) => ({ ...prev, subjectName: selectedOption ? selectedOption.value : "" }));
  // };

  const handleSubjectChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setFilters((prev) => ({ ...prev, subjectName: selectedValues }));
  };

  
  const handleYearChange = (selectedOption) => {
    setFilters((prev) => ({ ...prev, year: selectedOption ? selectedOption.value : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    toast.dismiss();
  
    // Check if any filter is applied
    if (
      filters.branch.length === 0 &&
      filters.subjectName.length === 0 &&
      !filters.year
    ) {
      toast.error("Please select at least one filter option.");
      return;
    }
  
    toast.loading("Fetching Notes...");
    onResults([]); // Clear previous results
  
    try {
      const notesRef = collection(db, "Notes");
      let q = query(notesRef);
  
      if (filters.subjectName.length > 0) {
        q = query(q, where("notesCategory.subjectName", "array-contains-any", filters.subjectName));
      }
  
      if (filters.year) {
        q = query(q, where("notesCategory.year", "==", filters.year));
      }
  
      const querySnapshot = await getDocs(q);
      let notes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      if (filters.branch.length > 0) {
        notes = notes.filter((note) => {
          const noteBranches = note.notesCategory.branch || [];
          return filters.branch.some((selectedBranch) =>
            noteBranches.includes(selectedBranch)
          );
        });
      }
  
      onResults(notes);
      toast.dismiss();
      if (notes.length === 0) toast.error("No notes found!");
      else toast.success("Notes loaded!");
    } catch (err) {
      console.error("Error fetching notes:", err);
      toast.dismiss();
      toast.error("Error fetching notes!");
    }
  };
  
  

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto"
    >
      <h3 className="text-lg font-semibold mb-4">Filter Notes</h3>
      {/* Branch - multi-select */}
      <div>
        <label className="block mb-1 font-medium">Branch</label>
        <Select
          isMulti
          closeMenuOnSelect={false}
          name="branch"
          components={animatedComponents}
          options={branches}
          className="basic-multi-select"
          classNamePrefix="select"
          value={filters.branch.map((val) => ({ value: val, label: val }))}
          onChange={handleBranchChange}
        />
      </div>

      {/* Subject - single select */}
      <div>
        <label className="block mb-1 font-medium">Subject</label>
        <Select
          isMulti
          name="subjectName"
          closeMenuOnSelect={false}
          options={subjects}
          components={animatedComponents}
          className="basic-multi-select"
          classNamePrefix="select"
          value={filters.subjectName.map((val) => ({ value: val, label: val }))}
          onChange={handleSubjectChange}
        />

      </div>

      {/* Year - single select */}
      <div>
        <label className="block mb-1 font-medium">Year</label>
        <Select
          name="year"
          options={years}
          components={animatedComponents}
          className="basic-single"
          classNamePrefix="select"
          isClearable
          value={
            filters.year ? years.find((opt) => opt.value === filters.year) : null
          }
          onChange={handleYearChange}
        />
      </div>

      <button
        type="submit"
        disabled={
          filters.branch.length === 0 &&
          filters.subjectName.length === 0 &&
          !filters.year
        }
        className={`w-full py-2 rounded text-white ${
          filters.branch.length === 0 &&
          filters.subjectName.length === 0 &&
          !filters.year
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Apply Filters
      </button>

    </form>
  );
};

export default NotesFilter;
