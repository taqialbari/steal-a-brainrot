/**
 * Main Page Component
 * Steal a Brainrot Frontend
 */

'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BrainrotGrid from '../components/BrainrotGrid';
import BrainrotModal from '../components/BrainrotModal';
import AdvancedFilters from '../components/AdvancedFilters';
import Stats from '../components/Stats';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { useBrainrots } from '../hooks/useBrainrots';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('updated_at:DESC');
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedBrainrot, setSelectedBrainrot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse sort value into sortBy and sortOrder
  const [sortBy, sortOrder] = sort.split(':');

  const { brainrots, loading, error, pagination } = useBrainrots({
    search: searchQuery || null,
    rarities: selectedRarities.length > 0 ? selectedRarities : null,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    sortBy,
    sortOrder,
    limit: 100
  });

  const handleCardClick = (brainrot) => {
    setSelectedBrainrot(brainrot);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    if (!selectedBrainrot || brainrots.length === 0) return;
    const currentIndex = brainrots.findIndex(b => b.id === selectedBrainrot.id);
    const nextIndex = (currentIndex + 1) % brainrots.length;
    setSelectedBrainrot(brainrots[nextIndex]);
  };

  const handlePrevious = () => {
    if (!selectedBrainrot || brainrots.length === 0) return;
    const currentIndex = brainrots.findIndex(b => b.id === selectedBrainrot.id);
    const prevIndex = (currentIndex - 1 + brainrots.length) % brainrots.length;
    setSelectedBrainrot(brainrots[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🧠 Steal a Brainrot
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Discover all {pagination?.total || 'brainrots'} brainrots from the Roblox game
          </p>

          {pagination && (
            <p className="text-gray-400">
              {searchQuery ? `Found ${brainrots.length} results` : `Showing ${brainrots.length} brainrots`}
            </p>
          )}
        </div>

        <Stats />

        <AdvancedFilters
          onSearchChange={setSearchQuery}
          onSortChange={setSort}
          onRarityChange={setSelectedRarities}
          onPriceRangeChange={setPriceRange}
          searchTerm={searchQuery}
          sort={sort}
          selectedRarities={selectedRarities}
          priceRange={priceRange}
        />

        {loading && <Loading />}
        {error && <Error message={error} onRetry={() => window.location.reload()} />}
        {!loading && !error && (
          <BrainrotGrid
            brainrots={brainrots}
            loading={loading}
            error={error}
            onCardClick={handleCardClick}
          />
        )}
      </main>

      <BrainrotModal
        brainrot={selectedBrainrot}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <Footer />
    </div>
  );
}

