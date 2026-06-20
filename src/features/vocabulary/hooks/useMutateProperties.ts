import { useState } from 'react';
import { VocabularyService } from '../services/vocabularyServices';
import { CreatePropertyDto, UpdatePropertyDto } from '../types';

export const useMutateProperties = (refreshVocabularies: () => Promise<void>) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createProperty = async (vocabularyId: number, data: CreatePropertyDto) => {
        setLoading(true);
        try {
            await VocabularyService.createProperty(vocabularyId, data);
            await refreshVocabularies();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'An error occurred while adding the property');
            } else if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'An error occurred while adding the property');
            } else {
                setError('An unknown error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProperty = async (propertyId: number, data: UpdatePropertyDto) => {
        setLoading(true);
        try {
            await VocabularyService.updateProperty(propertyId, data);
            await refreshVocabularies();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'An error occurred while updating the property');
            } else if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'An error occurred while updating the property');
            } else {
                setError('An unknown error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteProperty = async (propertyId: number) => {
        setLoading(true);
        try {
            await VocabularyService.deleteProperty(propertyId);
            await refreshVocabularies();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'An error occurred while deleting the property');
            } else if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'An error occurred while deleting the property');
            } else {
                setError('An unknown error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createProperty, updateProperty, deleteProperty, propLoading: loading, propError: error };
};