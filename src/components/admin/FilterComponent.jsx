import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useAuth } from '../../context/AuthContext';

const animatedComponents = makeAnimated();

const FilterComponent = ({ filter, setFilter, filterOptions, onFilterChange }) => {
  const { isGhost } = useAuth();

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    const updatedFilter = { ...filter, [name]: selectedOption ? selectedOption.value : '' };
    setFilter(updatedFilter);
    onFilterChange(updatedFilter);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFilter = { ...filter, [name]: value };
    setFilter(updatedFilter);
    onFilterChange(updatedFilter);
  };

  return isGhost ? (
    <div className="mb-4 p-4 bg-cyan-300 shadow-lg rounded-md">
      <h2 className="text-lg font-semibold">Filter Documents</h2>
      <div className="flex flex-col md:flex-row gap-4 mt-4">

        {/* Search Title */}
        <div className="w-full sm:w-auto md:w-auto lg:w-1/4 xl:w-1/4">
          <label className="block text-sm font-semibold text-black">Search Title</label>
          <input
            type="text"
            name="searchQuery"
            value={filter.searchQuery}
            onChange={handleInputChange}
            className="border rounded p-1 w-full max-w-full mt-2"
            placeholder="Search by Title"
          />
        </div>

        {/* Branch Filter */}
        <div className="w-full sm:w-auto md:w-auto lg:w-1/4 xl:w-1/4">
          <label className="block text-sm font-semibold text-black">Branch</label>
          <Select
            components={animatedComponents}
            name="branch"
            options={[
              { value: '', label: 'All Branches' },
              ...filterOptions.branches.map(branch => ({ value: branch, label: branch }))
            ]}
            value={
              filter.branch
                ? { value: filter.branch, label: filter.branch }
                : { value: '', label: 'All Branches' }
            }
            onChange={handleSelectChange}
            isClearable
            className="mt-2"
          />
        </div>

        {/* Institution Filter */}
        <div className="w-full sm:w-auto md:w-auto lg:w-1/4 xl:w-1/4">
          <label className="block text-sm font-semibold text-black">Institution</label>
          <Select
            components={animatedComponents}
            name="institution"
            options={[
              { value: '', label: 'All Institutions' },
              ...filterOptions.institutions.map(inst => ({ value: inst, label: inst }))
            ]}
            value={
              filter.institution
                ? { value: filter.institution, label: filter.institution }
                : { value: '', label: 'All Institutions' }
            }
            onChange={handleSelectChange}
            isClearable
            className="mt-2"
          />
        </div>


        {/* Year Filter */}
        <div className="w-full sm:w-auto md:w-auto lg:w-1/4 xl:w-1/4">
          <label className="block text-sm font-semibold text-black">Year</label>
          <Select
            components={animatedComponents}
            name="year"
            options={[
              { value: '', label: 'All Years' },
              ...filterOptions.years.map(year => ({ value: year, label: year }))
            ]}
            value={
              filter.year
                ? { value: filter.year, label: filter.year }
                : { value: '', label: 'All Years' }
            }
            onChange={handleSelectChange}
            isClearable
            className="mt-2"
          />
        </div>

      </div>
    </div>
  ) : null;
};

export default FilterComponent;
