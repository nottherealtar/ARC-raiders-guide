'use client';

import { useState, useEffect } from 'react';
import { globalSearch } from '@/lib/api';
import { Item, Quest, Guide } from '@/types';

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Search hook
export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    items: Item[];
    quests: Quest[];
    guides: Guide[];
  }>({ items: [], quests: [], guides: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      setIsLoading(true);
      globalSearch(debouncedQuery)
        .then(setResults)
        .finally(() => setIsLoading(false));
    } else {
      setResults({ items: [], quests: [], guides: [] });
    }
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isOpen,
    setIsOpen,
    hasResults: results.items.length > 0 || results.quests.length > 0 || results.guides.length > 0,
  };
}
