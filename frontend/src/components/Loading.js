/**
 * Loading Component
 * Loading spinner and skeleton
 */

'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-gray-400">Loading brainrots...</p>
      </div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gray-800 rounded-lg p-4 animate-pulse"
        >
          <div className="w-full h-48 bg-gray-700 rounded mb-4" />
          <div className="h-4 bg-gray-700 rounded mb-2" />
          <div className="h-4 bg-gray-700 rounded w-2/3" />
        </motion.div>
      ))}
    </div>
  );
}

