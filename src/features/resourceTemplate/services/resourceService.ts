import axios, { AxiosRequestConfig } from 'axios';
import { AddPropertiesToTemplateRequest, CreatePropertyDto, CreateResourceTemplateDto, GetTemplate, SystemProperty } from '../types/index';

const API_BASE_URL = process.env.NEXT_PUBLIC_PUBLIC_API_URL || 'http://localhost:5005/api';

const getAuthHeaders = (): AxiosRequestConfig => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    };
};

export const resourceService = {
    getTemplate: async (templateId: number): Promise<GetTemplate> => {
        const response = await axios.get<GetTemplate>(
            `${API_BASE_URL}/ResourceTemplate/${templateId}`,
            getAuthHeaders()
        );
        return response.data;
    },

    createTemplate: async (templateData: CreateResourceTemplateDto): Promise<{ success: boolean; id: number }> => {
        const response = await axios.post<{ success: boolean; id: number }>(
            `${API_BASE_URL}/ResourceTemplate`,
            templateData, 
            getAuthHeaders()
        );
        return response.data;
    },

    deleteTemplate: async (templateId: number): Promise<{ success: boolean; message?: string }> => {
        const response = await axios.delete<{ success: boolean; message?: string }>(
            `${API_BASE_URL}/ResourceTemplate/${templateId}`,
            getAuthHeaders()
        );
        return response.data;
    },

    updateTemplate: async (templateId: number, templateData: CreateResourceTemplateDto): Promise<{ success: boolean; message?: string }> => {
        const response = await axios.put<{ success: boolean; message?: string }>(
            `${API_BASE_URL}/ResourceTemplate/${templateId}`,
            templateData,
            getAuthHeaders()
        );
        return response.data;
    },

    addPropertiesToTemplate: async (
        templateId: number, 
        data: AddPropertiesToTemplateRequest
    ): Promise<{ success: boolean; message: string }> => {
        const response = await axios.post<{ success: boolean; message: string }>(
            `${API_BASE_URL}/ResourceTemplate/${templateId}/properties`,
            data, 
            getAuthHeaders()
        );
        return response.data;
    },

        getSystemProperties: async (): Promise<SystemProperty[]> => {
            const response = await axios.get(`http://localhost:5005/api/Property`);
            return response.data; 
        },

        createProperty: async (propertyData: CreatePropertyDto): Promise<{ success: boolean; message?: string }> => {
            const response = await axios.post('http://localhost:5005/api/Property', propertyData);
            return response.data;
        },

        updatePropertyInTemplate: async (
        templateId: number, 
        propertyId: number, 
        data: { isRequired: boolean; displayOrder: number; alternateLabel: string | null }
    ) => {
        const response = await axios.put(
            `http://localhost:5005/api/ResourceTemplate/${templateId}/properties/${propertyId}`,
            data
        );
        return response.data;
    },

    removePropertyFromTemplate: async (templateId: number, propertyId: number) => {
        const response = await axios.delete(
            `http://localhost:5005/api/ResourceTemplate/${templateId}/properties/${propertyId}`
        );
        return response.data;
    }

};