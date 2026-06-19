import { useState, useEffect, useCallback } from 'react';
import { resourceService } from '../services/resourceService';
import { TemplatePropertyItem } from '../types';

export const useTemplateDetails = (templateId: number) => {
    const [linkedProperties, setLinkedProperties] = useState<TemplatePropertyItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionError, setActionError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setActionError(null);

        try {
            const response = await resourceService.getTemplateWithProperties(templateId);
            setLinkedProperties(response.properties || []);
        } catch (error) {
            console.error('error', error);
            setActionError('Failed to fetch template data from server.');
        } finally {
            setIsLoading(false);
        }
    }, [templateId]);

    useEffect(() => {
        void Promise.resolve().then(refresh);
    }, [refresh]);

    const updatePropertyLocally = (propertyId: number, key: keyof TemplatePropertyItem, value: unknown) => {
        setLinkedProperties(prev =>
            prev.map(item =>
                item.propertyId === propertyId ? { ...item, [key]: value } : item
            )
        );
    };

    return {
        linkedProperties,
        isLoading,
        actionError,
        refresh,
        setActionError,
        updatePropertyLocally,
        setLinkedProperties
    };
};

export type { TemplatePropertyItem };