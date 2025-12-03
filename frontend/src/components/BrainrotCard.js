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

// Rarity color mapping
function getRarityColor(rarity) {
  const rarityColors = {
    'Common': 'bg-gray-500',
    'Rare': 'bg-blue-500',
    'Epic': 'bg-purple-500',
    'Legendary': 'bg-yellow-500',
    'Mythic': 'bg-red-500',
    'Brainrot God': 'bg-pink-600',
    'Secret': 'bg-indigo-600',
    'OG': 'bg-green-600',
    'Festive': 'bg-red-400',
    'Unknown': 'bg-gray-600'
  };
  return rarityColors[rarity] || 'bg-purple-600';
}

export default function BrainrotCard({ brainrot, index = 0, onClick, priority = false }) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = brainrot.image_url || brainrot.imageUrl;

  // Validate and construct image src
  let imageSrc = null;
  let isValidImage = false;

  if (imageUrl) {
    // Skip invalid URLs (lazy-load placeholders, data URIs, etc.)
    if (imageUrl.includes('data:image') || imageUrl.includes('base64')) {
      isValidImage = false;
    } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      // Valid external URL
      imageSrc = imageUrl;
      isValidImage = true;
    } else if (imageUrl.startsWith('/api/images/') || imageUrl.startsWith('/images/')) {
      // Local image path
      imageSrc = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${imageUrl}`;
      isValidImage = true;
    } else if (imageUrl.startsWith('/')) {
      // Other local paths
      imageSrc = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/images${imageUrl}`;
      isValidImage = true;
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer group relative"
      onClick={() => onClick && onClick(brainrot)}
      data-testid="brainrot-card"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(brainrot);
        }
      }}
      aria-label={`View details for ${brainrot.name}`}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-700 overflow-hidden">
        {!imageError && isValidImage && imageSrc ? (
          <motion.div variants={imageVariants} className="w-full h-full">
            <Image
              src={imageSrc}
              alt={brainrot.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              onError={() => setImageError(true)}
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              unoptimized
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
            <span className="text-6xl">🧠</span>
          </div>
        )}
        
        {/* Rarity Badge */}
        {(brainrot.rarity || brainrot.category) && (
          <div className="absolute top-2 left-2">
            <span className={`${getRarityColor(brainrot.rarity || brainrot.category)} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
              {brainrot.rarity || brainrot.category}
            </span>
          </div>
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

