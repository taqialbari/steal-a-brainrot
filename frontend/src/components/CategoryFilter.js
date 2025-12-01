/**
 * CategoryFilter Component
 * Filter brainrots by category
 */

'use client';

import { motion } from 'framer-motion';
import { useCategories } from '../hooks/useBrainrots';

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="flex space-x-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          selectedCategory === null
            ? 'bg-purple-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        All
      </motion.button>
      
      {categories.map((category) => (
        <motion.button
          key={category.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.name)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            selectedCategory === category.name
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {category.name} ({category.count})
        </motion.button>
      ))}
    </div>
  );
}

