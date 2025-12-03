/**
 * PriceRangeFilter Component
 * Slider for filtering brainrots by price range
 */

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PriceRangeFilter({ min = 0, max = 100000, value = [0, 100000], onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  const handleMinChange = (e) => {
    const newMin = parseFloat(e.target.value);
    const newValue = [newMin, Math.max(newMin, localValue[1])];
    setLocalValue(newValue);
  };

  const handleMaxChange = (e) => {
    const newMax = parseFloat(e.target.value);
    const newValue = [Math.min(newMax, localValue[0]), newMax];
    setLocalValue(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onChange(localValue);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const resetRange = () => {
    setLocalValue([min, max]);
    onChange([min, max]);
  };

  const isFiltered = localValue[0] !== min || localValue[1] !== max;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-300">
          Price Range
        </label>
        {isFiltered && (
          <button
            onClick={resetRange}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            aria-label="Reset price range filter"
          >
            Reset
          </button>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
        {/* Price Display */}
        <div className="flex justify-between items-center mb-4">
          <motion.div
            animate={{ scale: isDragging ? 1.05 : 1 }}
            className="text-lg font-bold text-purple-400"
          >
            {formatPrice(localValue[0])}
          </motion.div>
          <span className="text-gray-500">to</span>
          <motion.div
            animate={{ scale: isDragging ? 1.05 : 1 }}
            className="text-lg font-bold text-purple-400"
          >
            {formatPrice(localValue[1])}
          </motion.div>
        </div>

        {/* Dual Range Sliders */}
        <div className="relative pt-2 pb-6">
          {/* Min Slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={100}
            value={localValue[0]}
            onChange={handleMinChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-moz-range-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-purple-400 [&::-moz-range-thumb]:hover:bg-purple-400 [&::-webkit-slider-thumb]:border-2 [&::-moz-range-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:border-white"
            style={{ zIndex: localValue[0] > max - (max - min) / 4 ? 5 : 3 }}
            aria-label="Minimum price"
          />

          {/* Max Slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={100}
            value={localValue[1]}
            onChange={handleMaxChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-moz-range-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-purple-400 [&::-moz-range-thumb]:hover:bg-purple-400 [&::-webkit-slider-thumb]:border-2 [&::-moz-range-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:border-white"
            style={{ zIndex: 4 }}
            aria-label="Maximum price"
          />

          {/* Track Background */}
          <div className="absolute w-full h-2 bg-gray-700 rounded-full" />

          {/* Active Track */}
          <div
            className="absolute h-2 bg-purple-500 rounded-full"
            style={{
              left: `${((localValue[0] - min) / (max - min)) * 100}%`,
              right: `${100 - ((localValue[1] - min) / (max - min)) * 100}%`,
            }}
          />
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => { setLocalValue([0, 1000]); onChange([0, 1000]); }}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Under $1,000
          </button>
          <button
            onClick={() => { setLocalValue([1000, 10000]); onChange([1000, 10000]); }}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            $1K - $10K
          </button>
          <button
            onClick={() => { setLocalValue([10000, max]); onChange([10000, max]); }}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Over $10K
          </button>
        </div>
      </div>
    </div>
  );
}
