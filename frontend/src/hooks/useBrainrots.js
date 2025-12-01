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
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          ...(filters.category && { category: filters.category })
        };

        const response = await apiClient.getBrainrots(params);
        
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
  }, [filters.limit, filters.offset, filters.category]);

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

