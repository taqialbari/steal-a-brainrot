/**
 * Error Component
 * Error display
 */

'use client';

import { motion } from 'framer-motion';

export default function Error({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-900/50 border border-red-500 rounded-lg p-6 text-center"
    >
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-red-300 mb-2">Error</h3>
      <p className="text-red-200 mb-4">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}

