import { useEffect, useState, useCallback } from 'react';
import { VocabularyService } from '../services/vocabularyServices';
import { VocabularyDto } from '../types';

export const useVocabularyDetails = (id: string | undefined) => {
    const [vocabulary, setVocabulary] = useState<VocabularyDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Basic data fetching happens safely inside the Effect
    useEffect(() => {
        let isMounted = true; // To prevent state update if the component unmounts

        const fetchDetails = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const data = await VocabularyService.getVocabularyById(Number(id));
                if (isMounted) {
                    setVocabulary(data);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    if (err instanceof Error) {
                        setError(err.message || 'An error occurred while fetching vocabulary details');
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

        fetchDetails();

        return () => {
            isMounted = false; // Cleanup flag on component unmount
        };
    }, [id]); // The only dependency is id, preventing cascading renders

    // 2. Separate manual refetch function (e.g., when clicking a retry button)
    const refetch = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await VocabularyService.getVocabularyById(Number(id));
            setVocabulary(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'An error occurred while fetching vocabulary details');
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    return { vocabulary, loading, error, refetch };
};