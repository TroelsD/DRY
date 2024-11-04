import React from 'react';
import PropTypes from 'prop-types';
import './SearchFilters.css';

function SearchFilters({ filters, categories, brands, models, locations, onFilterChange, onClearFilters }) {
    return (
        <div className="filters">
            <select name="type" value={filters.type} onChange={onFilterChange}>
                <option value="">Type</option>
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
            <select name="brand" value={filters.brand} onChange={onFilterChange}>
                <option value="">Brand</option>
                {brands.map((brand) => (
                    <option key={brand} value={brand}>
                        {brand}
                    </option>
                ))}
            </select>
            <select name="model" value={filters.model} onChange={onFilterChange}>
                <option value="">Model</option>
                {models.map((model) => (
                    <option key={model} value={model}>
                        {model}
                    </option>
                ))}
            </select>
            <select name="location" value={filters.location} onChange={onFilterChange}>
                <option value="">Location</option>
                {locations.map((location) => (
                    <option key={location} value={location}>
                        {location}
                    </option>
                ))}
            </select>
            <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={onFilterChange}
                placeholder="Min Price"
            />
            <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={onFilterChange}
                placeholder="Max Price"
            />
            <input
                type="number"
                name="year"
                value={filters.year}
                onChange={onFilterChange}
                placeholder="Year"
            />
            <button className="clear-filters-button" onClick={onClearFilters}>
                Clear Filters
            </button>
        </div>
    );
}

SearchFilters.propTypes = {
    filters: PropTypes.object.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    brands: PropTypes.arrayOf(PropTypes.string).isRequired,
    models: PropTypes.arrayOf(PropTypes.string).isRequired,
    locations: PropTypes.arrayOf(PropTypes.string).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired,
};

export default SearchFilters;