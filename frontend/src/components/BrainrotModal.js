/**
 * BrainrotModal Component
 * Displays detailed information about a brainrot in a modal overlay
 */

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RARITY_COLORS = {
  'Common': 'bg-gray-500',
  'Rare': 'bg-blue-500',
  'Epic': 'bg-purple-500',
  'Legendary': 'bg-yellow-500',
  'Mythic': 'bg-red-500',
  'Brainrot God': 'bg-pink-600',
  'Secret': 'bg-indigo-600',
  'OG': 'bg-green-600',
  'Admin': 'bg-orange-600',
  'Taco': 'bg-yellow-700',
  'Festive': 'bg-red-700'
};

export default function BrainrotModal({ brainrot, isOpen, onClose, onNext, onPrevious }) {
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          if (onNext) onNext();
          break;
        case 'ArrowLeft':
          if (onPrevious) onPrevious();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!brainrot) return null;

  const rarityColor = RARITY_COLORS[brainrot.rarity] || 'bg-gray-500';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}?brainrot=${brainrot.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: brainrot.name,
          text: `Check out ${brainrot.name} - ${brainrot.rarity} brainrot!`,
          url: url
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Navigation buttons */}
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
                aria-label="Previous brainrot"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {onNext && (
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
                aria-label="Next brainrot"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Content */}
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Image Section */}
              <div className="flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">
                {brainrot.image_url ? (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={brainrot.image_url}
                    alt={brainrot.name}
                    className="w-full h-auto max-h-96 object-contain"
                    onError={(e) => {
                      e.target.src = '/placeholder-brainrot.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="flex flex-col space-y-4">
                {/* Title */}
                <h2
                  id="modal-title"
                  className="text-3xl font-bold text-white"
                >
                  {brainrot.name}
                </h2>

                {/* Rarity Badge */}
                <div className="flex items-center space-x-2">
                  <span className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded ${rarityColor}`}>
                    {brainrot.rarity || 'Unknown'}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-2xl font-bold text-green-400">
                    ${brainrot.price ? brainrot.price.toLocaleString() : 'N/A'}
                  </span>
                </div>

                {/* Description */}
                {brainrot.description && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Description</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {brainrot.description}
                    </p>
                  </div>
                )}

                {/* Category (if exists) */}
                {brainrot.category && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{brainrot.category}</span>
                  </div>
                )}

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                  {brainrot.metadata && brainrot.metadata.awardedCount && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Times Awarded:</span>
                      <span className="text-white">{brainrot.metadata.awardedCount.toLocaleString()}</span>
                    </div>
                  )}
                  {brainrot.created_at && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Added:</span>
                      <span className="text-white">
                        {new Date(brainrot.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span>Share</span>
                </button>

                {/* Source Attribution */}
                <div className="text-xs text-gray-500 text-center mt-4">
                  Data from <a href="https://stealabrainrot.fandom.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">Steal a Brainrot Fandom Wiki</a>
                </div>
              </div>
            </div>

            {/* Keyboard hints */}
            <div className="px-6 pb-4 text-center text-xs text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-800 rounded">ESC</kbd> to close
              {(onNext || onPrevious) && (
                <> • Use <kbd className="px-2 py-1 bg-gray-800 rounded">←</kbd> <kbd className="px-2 py-1 bg-gray-800 rounded">→</kbd> to navigate</>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
