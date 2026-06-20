import { useState, useEffect, useCallback } from 'react';
import { VocabularyService } from '../services/vocabularyServices';
import { VocabularyDto } from '../types';

export const useFetchVocabularies = () => {
  const [vocabularies, setVocabularies] = useState<VocabularyDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Isolate the fetching logic cleanly
  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const loadVocabularies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await VocabularyService.getAllVocabularies();
        if (isMounted) {
          setVocabularies(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (err instanceof Error) {
            setError(err.message || 'An error occurred while fetching data');
          } else if (typeof err === 'object' && err !== null && 'response' in err) {
            const axiosError = err as { response?: { data?: { message?: string } } };
            setError(axiosError.response?.data?.message || 'An error occurred while fetching data');
          } else {
            setError('An unknown error occurred');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVocabularies();

    return () => {
      isMounted = false; // Cleanup flag
    };
  }, []); // Empty dependency array means it safely runs once on mount without triggering cascading triggers

  // Expose a memoized refresh function for manual user triggers (like buttons)
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await VocabularyService.getAllVocabularies();
      setVocabularies(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred while fetching data');
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { vocabularies, setVocabularies, loading, error, refresh };
};