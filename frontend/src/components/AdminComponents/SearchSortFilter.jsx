/* eslint-disable react/prop-types */
import React, { useState } from "react";

function SearchSortFilter({ onSearch, onSort, onFilter, filters, sorts }) {
  const [searchText, setSearchText] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  // Handle search input changes
  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    onSearch(text);
  };

  // Handle sort selection changes
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSelectedSort(sortValue);
    onSort(sortValue);
  };

  // Handle filter selection changes
  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setSelectedFilter(filterValue);
    onFilter(filterValue);
  };

  return (
    <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow">
      {/* Search Input */}
      <input
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        placeholder="Search..."
        className="p-2 border rounded-lg w-1/3"
      />

      {/* Sort Dropdown */}
      <select
        value={selectedSort}
        onChange={handleSortChange}
        className="p-2 border rounded-lg"
      >
        <option value="">Sort By</option>
        {sorts.map((sort) => (
          <option key={sort.value} value={sort.value}>
            {sort.label}
          </option>
        ))}
      </select>

      {/* Filter Dropdown */}
      <select
        value={selectedFilter}
        onChange={handleFilterChange}
        className="p-2 border rounded-lg"
      >
        <option value="">Filter By</option>
        {filters.map((filter) => (
          <option key={filter.value} value={filter.value}>
            {filter.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchSortFilter;
