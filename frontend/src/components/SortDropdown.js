/**
 * SortDropdown Component
 * Dropdown for sorting brainrots by different criteria
 */

'use client';

import { motion } from 'framer-motion';

const SORT_OPTIONS = [
  { value: 'updated_at:DESC', label: 'Recently Updated', icon: '🕒' },
  { value: 'name:ASC', label: 'Name (A-Z)', icon: '🔤' },
  { value: 'name:DESC', label: 'Name (Z-A)', icon: '🔡' },
  { value: 'rarity:ASC', label: 'Rarity (Common → Rare)', icon: '⬆️' },
  { value: 'rarity:DESC', label: 'Rarity (Rare → Common)', icon: '⬇️' },
  { value: 'price:ASC', label: 'Price (Low → High)', icon: '💰' },
  { value: 'price:DESC', label: 'Price (High → Low)', icon: '💎' },
];

export default function SortDropdown({ value, onChange }) {
  const selectedOption = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];

  return (
    <div className="relative inline-block w-full max-w-xs">
      <label htmlFor="sort-select" className="block text-sm font-medium text-gray-300 mb-2">
        Sort By
      </label>
      <motion.select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border-2 border-purple-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
        aria-label="Sort brainrots"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.icon} {option.label}
          </option>
        ))}
      </motion.select>
    </div>
  );
}
