import { useContext, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { db, collection, query, where, getDocs } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { branches, years, subjects, contributors } from "../../assets/assets";
import { usePersistentState } from '../../hooks/usePersistentState';

const animatedComponents = makeAnimated();

const allContributorsOption = { value: "ALL_CONTRIBUTORS", label: "All Contributors" };
const contributorOptions = [allContributorsOption, ...contributors];

const NotesFilter = ({ onResults }) => {
  const [filterMode, setFilterMode] = useState("subjectName");
  const [filters, setFilters] = usePersistentState('notesFilters', {
    branch: null,
    subjectName: null,
    year: null,
    contributorName: []
  });

  const { toast } = useContext(AppContext);

  const handleBranchChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : null;
    setFilters((prev) => ({ ...prev, branch: selectedValue }));
  };

  const handleSubjectChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : null;
    setFilters((prev) => ({ ...prev, subjectName: selectedValue }));
  };

  const handleYearChange = (selectedOption) => {
    setFilters((prev) => ({ ...prev, year: selectedOption ? selectedOption.value : null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.dismiss();

    if (!filters.branch && !filters.subjectName && !filters.year) {
      toast.error("Please select at least one filter option.");
      return;
    }

    toast.loading("Fetching Notes...");
    onResults([]);

    try {
      const notesRef = collection(db, "Notes");
      let conditions = [];

      if (filterMode === "branch") {
        if (filters.branch) {
          conditions.push(where("notesCategory.branch", "array-contains", filters.branch));
        } else {
          toast.error("Please select a Branch.");
          toast.dismiss();
          return;
        }
        if (filters.year) {
          conditions.push(where("notesCategory.year", "==", filters.year));
        } else {
          toast.error("Please select Year.");
          toast.dismiss();
          return;
        }
      } else if (filterMode === "subjectName") {
        if (filters.subjectName) {
          conditions.push(where("notesCategory.subjectName", "array-contains", filters.subjectName));
        } else {
          toast.error("Please select a Subject Name.");
          toast.dismiss();
          return;
        }
        if ((filters.contributorName || []).length > 0) {
          conditions.push(where("contributorName", "in", filters.contributorName));
        } else {
          toast.error("Please select at least one Contributor Name.");
          toast.dismiss();
          return;
        }
      }

      const q = query(notesRef, ...conditions);
      const querySnapshot = await getDocs(q);

      const notes = [];
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
      });

      onResults(notes);

      toast.dismiss();
      if (notes.length === 0) {
        toast.error("No notes found!");
      } else {
        toast.success("Notes loaded successfully!");
      }
    } catch (err) {
      console.error("Error fetching notes:", err);

      toast.dismiss();
      toast.error("Error fetching notes!");
    }
  };

  const clearFilters = () => {
    setFilters({
      branch: null,
      subjectName: null,
      year: null,
      contributorName: []
    });
    toast.dismiss();
    toast.success("Filters cleared!");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filter Notes</h3>
        <button
          type="button"
          onClick={() => setFilterMode((prev) => (prev === "branch" ? "subjectName" : "branch"))}
          className="text-sm text-white hover:animate-pulse hover:bg-indigo-700 bg-indigo-500 rounded-full h-6 px-3"
        >
          Filter by - {filterMode === "branch" ? "Subject Name" : "Branch"}
        </button>
      </div>

      {filterMode === "branch" ? (
        <>
          <div>
            <label className="block mb-1 font-medium">Branch</label>
            <Select
              isClearable
              closeMenuOnSelect={true}
              name="branch"
              components={animatedComponents}
              options={branches}
              className="basic-single"
              classNamePrefix="select"
              value={filters.branch ? { value: filters.branch, label: filters.branch } : null}
              onChange={handleBranchChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Year</label>
            <Select
              name="year"
              options={years}
              components={animatedComponents}
              className="basic-single"
              classNamePrefix="select"
              isClearable
              value={filters.year ? years.find((opt) => opt.value === filters.year) : null}
              onChange={handleYearChange}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block mb-1 font-medium">Subject Name</label>
            <Select
              isClearable
              closeMenuOnSelect={true}
              name="subjectName"
              components={animatedComponents}
              options={subjects}
              className="basic-single"
              classNamePrefix="select"
              value={filters.subjectName ? { value: filters.subjectName, label: filters.subjectName } : null}
              onChange={handleSubjectChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Contributor Name</label>
            <Select
              isMulti
              name="contributorName"
              components={animatedComponents}
              options={contributorOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={
                (filters.contributorName || []).length === contributors.length
                  ? [allContributorsOption]
                  : (filters.contributorName || []).map((val) => ({ value: val, label: val }))
              }
              onChange={(selected) => {
                if (!selected || selected.length === 0) {
                  setFilters((prev) => ({ ...prev, contributorName: [] }));
                  return;
                }

                const selectedValues = selected.map((s) => s.value);

                if (selectedValues.includes("ALL_CONTRIBUTORS")) {
                  setFilters((prev) => ({ ...prev, contributorName: contributors.map((c) => c.value) }));
                } else {
                  setFilters((prev) => ({ ...prev, contributorName: selectedValues }));
                }
              }}
            />
            {(filters.contributorName || []).length === contributors.length && (
              <p className="text-sm text-gray-500 mt-1">(All Contributors Selected)</p>
            )}
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
          disabled={
            (filterMode === "branch" && (!filters.branch || !filters.year)) ||
            (filterMode === "subjectName" && (!filters.subjectName || (filters.contributorName || []).length === 0))
          }
          className={`w-full py-2 rounded text-white ${(filterMode === "branch" && (!filters.branch || !filters.year)) ||
            (filterMode === "subjectName" && (!filters.subjectName || (filters.contributorName || []).length === 0))
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default NotesFilter;