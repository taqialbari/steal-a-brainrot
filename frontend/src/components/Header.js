/**
 * Header Component
 * Main navigation header
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-2xl font-bold text-white"
            >
              🧠 Steal a Brainrot
            </motion.div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-200 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="text-gray-200 hover:text-white transition-colors"
            >
              Categories
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

