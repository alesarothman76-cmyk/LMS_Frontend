import apiClient from "../../../shared/api/apiclient";
import { ApiEndpoints } from "../../../shared/api/ApiEndpoints";
import { 
    VocabularyDto, 
    CreateVocabularyDto, 
    UpdateVocabularyDto,
    CreatePropertyDto,
    UpdatePropertyDto 
} from '../types';

export const VocabularyService = {
    // Fetch all vocabularies (Public)
    getAllVocabularies: async (): Promise<VocabularyDto[]> => {
        const response = await apiClient.get<VocabularyDto[]>(ApiEndpoints.vocabularies.GET_ALL);
        return response.data;
    },

    // Fetch vocabulary by ID (Public)
    getVocabularyById: async (id: number): Promise<VocabularyDto> => {
        const response = await apiClient.get<VocabularyDto>(ApiEndpoints.vocabularies.GET_BY_ID(id));
        return response.data;
    },

    // Fetch vocabulary by Prefix (Public)
    getVocabularyByPrefix: async (prefix: string): Promise<VocabularyDto> => {
        const response = await apiClient.get<VocabularyDto>(ApiEndpoints.vocabularies.GET_BY_PREFIX(prefix));
        return response.data;
    },

    // Create a new vocabulary (Admin Only)
    createVocabulary: async (data: CreateVocabularyDto): Promise<VocabularyDto> => {
        const response = await apiClient.post<VocabularyDto>(ApiEndpoints.vocabularies.CREATE, data);
        return response.data;
    },

    // Update an existing vocabulary (Admin Only)
    updateVocabulary: async (id: number, data: UpdateVocabularyDto): Promise<void> => {
        await apiClient.put(ApiEndpoints.vocabularies.UPDATE(id), data);
    },

    // Delete a vocabulary (Admin Only)
    deleteVocabulary: async (id: number): Promise<void> => {
        await apiClient.delete(ApiEndpoints.vocabularies.DELETE(id));
    },

    // Add a new property to a specific vocabulary (Admin Only)
    createProperty: async (vocabularyId: number, data: CreatePropertyDto): Promise<void> => {
        await apiClient.post(ApiEndpoints.vocabularies.CREATE_PROPERTY(vocabularyId), data);
    },

    // Update a specific property (Admin Only)
    updateProperty: async (propertyId: number, data: UpdatePropertyDto): Promise<void> => {
        await apiClient.put(ApiEndpoints.vocabularies.UPDATE_PROPERTY(propertyId), data);
    },

    // Delete a specific property (Admin Only)
    deleteProperty: async (propertyId: number): Promise<void> => {
        await apiClient.delete(ApiEndpoints.vocabularies.DELETE_PROPERTY(propertyId));
    }
};