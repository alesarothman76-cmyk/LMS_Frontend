import { useFetchVocabularies } from './useFetchVocabularies';
import { useMutateVocabulary } from './useMutateVocabulary';
import { useMutateProperties } from './useMutateProperties';

export const useVocabulary = () => {
    const { vocabularies, setVocabularies, loading: fetchLoading, error: fetchError, refresh } = useFetchVocabularies();
    
    const { addVocabulary, editVocabulary, removeVocabulary, mutationLoading, mutationError } = useMutateVocabulary(setVocabularies);
    
    const { createProperty, updateProperty, deleteProperty, propLoading, propError } = useMutateProperties(refresh);

    return {
        vocabularies,
        loading: fetchLoading || mutationLoading || propLoading,
        error: fetchError || mutationError || propError,
        refresh,
        addVocabulary,
        editVocabulary,
        removeVocabulary,
        createProperty,
        updateProperty,
        deleteProperty,
    };
};