import { apiClient } from '../../../shared/api/apiclient';
import { ApiEndpoints } from '../../../shared/api/ApiEndpoints';
import { createQueryConfig, QueryFilterObject } from '../../../shared/api/apihelper';

import {  
    AddPropertiesToTemplateRequest,
    CreatePropertyDto, 
    CreateResourceTemplateDto, 
    GetTemplate, 
    GetTemplateWithProperties, 
    PropertyToTemplateInput, 
    SystemProperty,
    UpdateResourceTemplateDto 
} from '../types/index';

export const resourceService = {

    // 1. get template by ID
    getTemplate: async (templateId: number): Promise<GetTemplate> => {
        const response = await apiClient.get<GetTemplate>(
            ApiEndpoints.resourceTemplates.GET_BY_ID(templateId)
        );
        return response.data;
    },

    // 1a. get template details including linked properties
    getTemplateWithProperties: async (templateId: number): Promise<GetTemplateWithProperties> => {
        const response = await apiClient.get<GetTemplateWithProperties>(
            ApiEndpoints.resourceTemplates.GET_BY_ID(templateId)
        );
        return response.data;
    },

    // 2. create a new resource template
    createTemplate: async (templateData: CreateResourceTemplateDto): Promise<{ success: boolean; id: number }> => {
        const response = await apiClient.post<{ success: boolean; id: number }>(
            ApiEndpoints.resourceTemplates.CREATE,
            templateData
        );
        return response.data;
    },

    // 3. delete a resource template
    deleteTemplate: async (templateId: number): Promise<{ success: boolean; message?: string }> => {
        const response = await apiClient.delete<{ success: boolean; message?: string }>(
            ApiEndpoints.resourceTemplates.DELETE(templateId)
        );
        return response.data;
    },

    // 4. update a resource template
    updateTemplate: async (templateId: number, templateData: UpdateResourceTemplateDto): Promise<{ success: boolean; message?: string }> => {
        const response = await apiClient.put<{ success: boolean; message?: string }>(
            ApiEndpoints.resourceTemplates.UPDATE(templateId),
            templateData
        );
        return response.data;
    },

    // 5. add properties to a resource template
    addPropertiesToTemplate: async (
    templateId: number, 
    data: AddPropertiesToTemplateRequest | PropertyToTemplateInput[]
        ): Promise<{ success: boolean; message: string }> => {
    const properties = Array.isArray(data) ? data : data.properties;
    
    const response = await apiClient.post<{ success: boolean; message: string }>(
        ApiEndpoints.resourceTemplates.ADD_PROPERTIES(templateId),
        properties  
    );
    return response.data;
},

    // 6. get vocabularies with their properties
    getVocabulariesWithProperties: async (): Promise<unknown[]> => {
        const response = await apiClient.get(ApiEndpoints.vocabularies.GET_ALL);
        return response.data;
    },

    // 7. get system properties
    getSystemProperties: async (filters: QueryFilterObject = {}): Promise<SystemProperty[]> => {
        const response = await apiClient.get<SystemProperty[]>(
            '/Property', 
            createQueryConfig(filters) 
        );
        return response.data; 
    },

    createProperty: async (propertyData: CreatePropertyDto): Promise<{ success: boolean; message?: string }> => {
        const response = await apiClient.post('/Property', propertyData);
        return response.data;
    },

    // 8. update a property in a resource template
    updatePropertyInTemplate: async (
        templateId: number, 
        propertyId: number, 
        data: { isRequired: boolean; displayOrder: number; alternateLabel: string | null }
    ) => {
        const response = await apiClient.put(
            ApiEndpoints.resourceTemplates.UPDATE_PROPERTY(templateId, propertyId),
            data
        );
        return response.data;
    },

    // 9. remove a property from a resource template
    removePropertyFromTemplate: async (templateId: number, propertyId: number) => {
        const response = await apiClient.delete(
            ApiEndpoints.resourceTemplates.REMOVE_PROPERTY(templateId, propertyId)
        );
        return response.data;
    },

    // 10. Get All Templates
    getAllTemplates: async (filters: QueryFilterObject = {}): Promise<GetTemplate[]> => {
        const config = createQueryConfig(filters);
        
        const response = await apiClient.get<GetTemplate[]>(
            ApiEndpoints.resourceTemplates.GET_ALL,
            config
        );
        return response.data;
    },
};