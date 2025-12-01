/**
 * Main Page Component
 * Steal a Brainrot Frontend
 */

'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BrainrotGrid from '../components/BrainrotGrid';
import CategoryFilter from '../components/CategoryFilter';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { useBrainrots } from '../hooks/useBrainrots';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { brainrots, loading, error, pagination } = useBrainrots({
    category: selectedCategory,
    limit: 50
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🧠 Steal a Brainrot
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Discover all brainrots from the Roblox game
          </p>
          
          {pagination && (
            <p className="text-gray-400">
              Showing {brainrots.length} of {pagination.total} brainrots
            </p>
          )}
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {loading && <Loading />}
        {error && <Error message={error} onRetry={() => window.location.reload()} />}
        {!loading && !error && (
          <BrainrotGrid
            brainrots={brainrots}
            loading={loading}
            error={error}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

