/**
 * BrainrotCard Component
 * Individual brainrot card with animations
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  hover: {
    scale: 1.05,
    y: -8,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
};

const imageVariants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export default function BrainrotCard({ brainrot, index = 0 }) {
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = brainrot.image_url || brainrot.imageUrl;
  // Handle both /api/images/ and /images/ paths, and external URLs
  let imageSrc = null;
  if (imageUrl) {
    if (imageUrl.startsWith('http')) {
      imageSrc = imageUrl;
    } else if (imageUrl.startsWith('/api/images/') || imageUrl.startsWith('/images/')) {
      imageSrc = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${imageUrl}`;
    } else {
      imageSrc = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/images${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-700 overflow-hidden">
        {!imageError && imageUrl ? (
          <motion.div variants={imageVariants} className="w-full h-full">
            <Image
              src={imageSrc}
              alt={brainrot.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
            <span className="text-6xl">🧠</span>
          </div>
        )}
        
        {/* Category Badge */}
        {brainrot.category && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute top-2 left-2"
          >
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {brainrot.category}
            </span>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {brainrot.name}
        </h3>
        
        {/* Price */}
        {brainrot.price !== null && brainrot.price !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Price:</span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="text-xl font-bold text-green-400"
            >
              {brainrot.price === 0 ? 'Free' : `$${brainrot.price.toLocaleString()}`}
            </motion.span>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          View Details
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

