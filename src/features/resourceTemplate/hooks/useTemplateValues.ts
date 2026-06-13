import { useState, useEffect, useCallback } from 'react';
import { resourceService } from '../services/resourceService';
import { GetTemplate } from '../types/index';
import axios from 'axios';

export const useTemplateValues = (resourceId: number) => {
    const [template, setTemplate] = useState<GetTemplate | null>(null);
    const [loading, setLoading] = useState<boolean>(false); 
    const [error, setError] = useState<string | null>(null);

    const fetchValues = useCallback(async () => {
        if (!resourceId || isNaN(resourceId)) return;
        
        try {
            setLoading(true); 
            setError(null);
            const data = await resourceService.getTemplate(resourceId);
            setTemplate(data); 
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.Message || "Failed to load template data");
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, [resourceId]);

    useEffect(() => {
        if (resourceId && !isNaN(resourceId)) {
void Promise.resolve().then(fetchValues);        }
    }, [fetchValues, resourceId]);

    return { template, loading, error, refreshValues: fetchValues };
};