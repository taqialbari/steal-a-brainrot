/**
 * AdvancedFilters Component
 * Comprehensive filtering and sorting interface for brainrots
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SortDropdown from './SortDropdown';
import MultiRarityFilter from './MultiRarityFilter';
import PriceRangeFilter from './PriceRangeFilter';

export default function AdvancedFilters({
  onSearchChange,
  onSortChange,
  onRarityChange,
  onPriceRangeChange,
  searchTerm = '',
  sort = 'updated_at:DESC',
  selectedRarities = [],
  priceRange = [0, 100000]
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(localSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm]);

  // Notify parent of search changes
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const clearAllFilters = () => {
    setLocalSearchTerm('');
    onSearchChange('');
    onRarityChange([]);
    onPriceRangeChange([0, 100000]);
    onSortChange('updated_at:DESC');
  };

  const hasActiveFilters =
    localSearchTerm !== '' ||
    selectedRarities.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100000 ||
    sort !== 'updated_at:DESC';

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </div>
          <input
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            placeholder="Search brainrots by name or description..."
            className="w-full pl-12 pr-12 py-4 bg-gray-800 text-white rounded-lg border-2 border-purple-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            aria-label="Search brainrots"
          />
          {localSearchTerm && (
            <button
              onClick={() => setLocalSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {debouncedSearch && (
          <p className="text-gray-400 text-sm mt-2 text-center">
            Searching for: "{debouncedSearch}"
          </p>
        )}
      </motion.div>

      {/* Filter Toggle and Sort */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            aria-expanded={showFilters}
            aria-controls="advanced-filters-panel"
          >
            <span>{showFilters ? '▲' : '▼'}</span>
            <span>Advanced Filters</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-purple-800 rounded-full text-xs">
                Active
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto min-w-[300px]">
            <SortDropdown value={sort} onChange={onSortChange} />
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={clearAllFilters}
              className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-all"
              aria-label="Clear all filters"
            >
              Clear All
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            id="advanced-filters-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg p-6 border-2 border-gray-700 space-y-6">
              {/* Multi-Rarity Filter */}
              <MultiRarityFilter
                selectedRarities={selectedRarities}
                onChange={onRarityChange}
              />

              {/* Price Range Filter */}
              <PriceRangeFilter
                min={0}
                max={100000}
                value={priceRange}
                onChange={onPriceRangeChange}
              />

              {/* Filter Summary */}
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  {selectedRarities.length > 0 && (
                    <span>{selectedRarities.length} rarity filter{selectedRarities.length !== 1 ? 's' : ''} active • </span>
                  )}
                  {(priceRange[0] !== 0 || priceRange[1] !== 100000) && (
                    <span>Price range filtered • </span>
                  )}
                  {!hasActiveFilters && 'No filters applied'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
