import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext'
import AccessForbidden from '../student/AccessForbidden';


const FilterComponent = ({ filter, setFilter, filterOptions, onFilterChange }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilter = { ...filter, [name]: value };
    setFilter(updatedFilter);  // Update the parent filter state
    onFilterChange(updatedFilter);  // Apply the filter on data immediately
  };


  const { isGhost } = useAuth();

  return isGhost ? (
    <div className="mb-4 p-4 bg-cyan-300 shadow-lg rounded-md">
      <h2 className="text-lg font-semibold">Filter Documents</h2>
      <div className="flex flex-col md:flex-row gap-4 mt-4">

        {/* Branch Filter */}
        <div className="w-full sm:w-auto md:w-auto lg:w-1/4 xl:w-1/4">
          <label className="block text-sm font-semibold text-black">Branch</label>
          <select
            name="branch"
            value={filter.branch}
            onChange={handleFilterChange}
            className="border p-2 w-full max-w-full mt-2 md:mt-0"
          >
            <option value="">All Branches</option>
            {filterOptions.branches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>

        {/* Institution Filter */}
        <div className='w-full sm:w-auto md:w-auto lg:w-1/4 xl:w-1/4'>
          <label className="block text-sm font-semibold text-black">Institution</label>
          <input
            type="text"
            name="institution"
            value={filter.institution}
            onChange={handleFilterChange}
            className="border p-2 w-full max-w-full mt-2 md:mt-0"
            placeholder="Example: Mumbai University"
          />
        </div>

        {/* Year Filter */}
        <div className='w-full sm:w-auto md:w-auto lg:w-1/4 xl:w-1/4'>
          <label className="block text-sm font-semibold text-black">Year</label>
          <select
            name="year"
            value={filter.year}
            onChange={handleFilterChange}
            className="border p-2 w-full max-w-full mt-2 md:mt-0"
          >
            <option value="">All Years</option>
            {filterOptions.years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  ) : null
};

export default FilterComponent;
