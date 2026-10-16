import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { searchCities } from '@shared/api';
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_LENGTH } from '@shared/config';
import { language } from '@shared/lib/i18n';

const useDebounced = <T>(value: T, delay: number) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

export const useCitySearch = (query: string) => {
  const term = useDebounced(query.trim(), SEARCH_DEBOUNCE_MS);
  const enabled = term.length >= SEARCH_MIN_LENGTH;

  const result = useQuery({
    queryKey: ['city-search', language, term.toLowerCase()],
    queryFn: ({ signal }) => searchCities(term, language, signal),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 24 * 60 * 60 * 1000,
  });

  return {
    ...result,
    term,
    enabled,
    // True while the user is still typing or the request is in flight.
    pending: query.trim() !== term || result.isFetching,
  };
};
