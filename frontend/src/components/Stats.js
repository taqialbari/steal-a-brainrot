/**
 * Stats Component
 * Displays collection statistics and rarity distribution
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../lib/api';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await apiClient.request('/api/brainrots/rarities');
        setStats(response.data || []);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setStats([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (!stats || stats.length === 0) {
    return null;
  }

  const totalBrainrots = stats.reduce((sum, s) => sum + parseInt(s.count), 0);

  // Rarity color mapping
  const rarityColors = {
    'Common': 'from-gray-600 to-gray-500',
    'Rare': 'from-blue-600 to-blue-500',
    'Epic': 'from-purple-600 to-purple-500',
    'Legendary': 'from-yellow-600 to-yellow-500',
    'Mythic': 'from-red-600 to-red-500',
    'Brainrot God': 'from-pink-700 to-pink-600',
    'Secret': 'from-indigo-700 to-indigo-600',
    'OG': 'from-green-700 to-green-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20"
      data-testid="stats-component"
    >
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Collection Statistics
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Count */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-4 text-center"
        >
          <div className="text-3xl font-bold text-white">{totalBrainrots}</div>
          <div className="text-sm text-gray-200">Total Brainrots</div>
        </motion.div>

        {/* Rarity Distribution - Top 3 */}
        {stats.slice(0, 3).map((stat, index) => (
          <motion.div
            key={stat.rarity}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${rarityColors[stat.rarity] || 'from-gray-600 to-gray-500'} rounded-lg p-4 text-center`}
          >
            <div className="text-3xl font-bold text-white">{stat.count}</div>
            <div className="text-sm text-gray-200">{stat.rarity}</div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      {stats.length > 4 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {stats.slice(3).map((stat) => (
            <div
              key={stat.rarity}
              className="bg-gray-700/50 rounded px-3 py-2 flex justify-between items-center"
            >
              <span className="text-gray-300 text-sm">{stat.rarity}</span>
              <span className="text-white font-semibold">{stat.count}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
