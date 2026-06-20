import { useState } from 'react';
import { VocabularyService } from '../services/vocabularyServices';
import { CreateVocabularyDto, UpdateVocabularyDto, VocabularyDto } from '../types';

export const useMutateVocabulary = (setVocabularies: React.Dispatch<React.SetStateAction<VocabularyDto[]>>) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addVocabulary = async (data: CreateVocabularyDto) => {
        setLoading(true);
        try {
            const newVoc = await VocabularyService.createVocabulary(data);
            setVocabularies((prev) => [...prev, newVoc]);
            return newVoc;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'An error occurred while adding');
            } else if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'An error occurred while adding');
            } else {
                setError('An unknown error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const editVocabulary = async (id: number | string, data: UpdateVocabularyDto) => {
        setLoading(true);
        try {
            await VocabularyService.updateVocabulary(Number(id), data);
            setVocabularies((prev) => 
                prev.map((item) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            ...data,
                            // Convert properties from CreatePropertyDto to safe PropertyDto
                            properties: data.properties 
                                ? data.properties.map((prop, index) => ({
                                    id: `temp-id-${Date.now()}-${index}`, // Generate temporary id to meet PropertyDto requirements
                                    label: prop.label,
                                    uri: prop.termUri
                                })) 
                                : item.properties
                        };
                    }
                    return item;
                })
            );
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'An error occurred while updating');
            } else if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'An error occurred while updating');
            } else {
                setError('An unknown error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeVocabulary = async (id: number) => {
        setLoading(true);
        try {
            await VocabularyService.deleteVocabulary(id);
            setVocabularies((prev) => prev.filter((item) => (item as VocabularyDto).id !== id));
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'An error occurred while deleting');
            } else if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'An error occurred while deleting');
            } else {
                setError('An unknown error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { addVocabulary, editVocabulary, removeVocabulary, mutationLoading: loading, mutationError: error };
};