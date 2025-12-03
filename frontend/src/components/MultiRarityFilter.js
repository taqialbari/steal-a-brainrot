/**
 * MultiRarityFilter Component
 * Multi-select checkbox filter for rarities
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const RARITIES = [
  { value: 'Common', label: 'Common', color: 'bg-gray-500' },
  { value: 'Rare', label: 'Rare', color: 'bg-blue-500' },
  { value: 'Epic', label: 'Epic', color: 'bg-purple-500' },
  { value: 'Legendary', label: 'Legendary', color: 'bg-yellow-500' },
  { value: 'Mythic', label: 'Mythic', color: 'bg-red-500' },
  { value: 'Brainrot God', label: 'Brainrot God', color: 'bg-pink-600' },
  { value: 'Secret', label: 'Secret', color: 'bg-cyan-400' },
  { value: 'OG', label: 'OG', color: 'bg-orange-500' },
  { value: 'Admin', label: 'Admin', color: 'bg-indigo-600' },
  { value: 'Taco', label: 'Taco', color: 'bg-amber-600' },
  { value: 'Festive', label: 'Festive', color: 'bg-green-500' },
];

export default function MultiRarityFilter({ selectedRarities = [], onChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleRarity = (rarity) => {
    if (selectedRarities.includes(rarity)) {
      onChange(selectedRarities.filter(r => r !== rarity));
    } else {
      onChange([...selectedRarities, rarity]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange(RARITIES.map(r => r.value));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-300">
          Rarity Filters {selectedRarities.length > 0 && `(${selectedRarities.length} selected)`}
        </label>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="rarity-filter-list"
        >
          {isExpanded ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="rarity-filter-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
              {/* Quick Actions */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={selectAll}
                  className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors"
                  aria-label="Select all rarities"
                >
                  Select All
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  aria-label="Clear all rarity filters"
                >
                  Clear All
                </button>
              </div>

              {/* Rarity Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {RARITIES.map((rarity) => {
                  const isSelected = selectedRarities.includes(rarity.value);
                  return (
                    <motion.label
                      key={rarity.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all
                        ${isSelected
                          ? `${rarity.color} text-white font-semibold`
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRarity(rarity.value)}
                        className="w-4 h-4 rounded focus:ring-2 focus:ring-purple-500"
                        aria-label={`Filter by ${rarity.label} rarity`}
                      />
                      <span className="text-sm">{rarity.label}</span>
                    </motion.label>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Rarity Pills */}
      {selectedRarities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedRarities.map((rarityValue) => {
            const rarity = RARITIES.find(r => r.value === rarityValue);
            if (!rarity) return null;

            return (
              <motion.div
                key={rarityValue}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${rarity.color} text-white text-sm font-semibold`}
              >
                <span>{rarity.label}</span>
                <button
                  onClick={() => toggleRarity(rarityValue)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${rarity.label} filter`}
                >
                  ✕
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
