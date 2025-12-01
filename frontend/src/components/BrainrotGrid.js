/**
 * BrainrotGrid Component
 * Grid layout for brainrots with animations
 */

'use client';

import { motion } from 'framer-motion';
import BrainrotCard from './BrainrotCard';
import { LoadingSkeleton } from './Loading';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function BrainrotGrid({ brainrots, loading, error }) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  if (!brainrots || brainrots.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No brainrots found</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {brainrots.map((brainrot, index) => (
        <BrainrotCard
          key={brainrot.id}
          brainrot={brainrot}
          index={index}
        />
      ))}
    </motion.div>
  );
}

