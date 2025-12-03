/**
 * SearchAndFilter Component
 * Search bar and rarity filter for brainrots
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RARITIES = [
  { value: '', label: 'All Rarities', color: 'bg-gray-600' },
  { value: 'Common', label: 'Common', color: 'bg-gray-500' },
  { value: 'Rare', label: 'Rare', color: 'bg-blue-500' },
  { value: 'Epic', label: 'Epic', color: 'bg-purple-500' },
  { value: 'Legendary', label: 'Legendary', color: 'bg-yellow-500' },
  { value: 'Mythic', label: 'Mythic', color: 'bg-red-500' },
  { value: 'Brainrot God', label: 'Brainrot God', color: 'bg-pink-600' },
  { value: 'Secret', label: 'Secret', color: 'bg-indigo-600' },
  { value: 'OG', label: 'OG', color: 'bg-green-600' }
];

export default function SearchAndFilter({ onSearchChange, onRarityChange, selectedRarity = '' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Notify parent of search changes
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search brainrots by name..."
            className="w-full px-6 py-4 bg-gray-800 text-white rounded-lg border-2 border-purple-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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

      {/* Rarity Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {RARITIES.map((rarity) => (
          <motion.button
            key={rarity.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRarityChange(rarity.value)}
            className={`
              px-4 py-2 rounded-full font-semibold text-white transition-all
              ${selectedRarity === rarity.value
                ? `${rarity.color} ring-2 ring-white scale-105`
                : `${rarity.color} opacity-60 hover:opacity-100`
              }
            `}
          >
            {rarity.label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
