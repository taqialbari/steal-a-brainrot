/**
 * useBrainrots Hook
 * Custom hook for fetching brainrots data
 */

'use client';

import { useState, useEffect } from 'react';
import apiClient from '../lib/api';

export function useBrainrots(filters = {}) {
  const [brainrots, setBrainrots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    async function fetchBrainrots() {
      try {
        setLoading(true);
        setError(null);

        const params = {
          limit: filters.limit || 100,
          offset: filters.offset || 0,
          ...(filters.category && { category: filters.category }),
          ...(filters.rarity && { rarity: filters.rarity }),
          ...(filters.rarities && filters.rarities.length > 0 && { rarities: filters.rarities }),
          ...(filters.priceMin !== null && filters.priceMin !== undefined && { priceMin: filters.priceMin }),
          ...(filters.priceMax !== null && filters.priceMax !== undefined && { priceMax: filters.priceMax }),
          ...(filters.sortBy && { sortBy: filters.sortBy }),
          ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
          ...(filters.search && { q: filters.search })
        };

        // Use search endpoint if search query is present
        const response = filters.search
          ? await apiClient.searchBrainrots(params)
          : await apiClient.getBrainrots(params);

        setBrainrots(response.data || []);
        setPagination(response.pagination || null);
      } catch (err) {
        setError(err.message || 'Failed to fetch brainrots');
        setBrainrots([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBrainrots();
  }, [
    filters.limit,
    filters.offset,
    filters.category,
    filters.rarity,
    JSON.stringify(filters.rarities), // Stringify array for dependency comparison
    filters.priceMin,
    filters.priceMax,
    filters.sortBy,
    filters.sortOrder,
    filters.search
  ]);

  return { brainrots, loading, error, pagination };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getCategories();
        setCategories(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

