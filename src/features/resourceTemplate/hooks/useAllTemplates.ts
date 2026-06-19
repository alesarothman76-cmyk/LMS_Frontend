import { useState, useEffect, useCallback } from 'react';
import { resourceService } from '../services/resourceService';
import { GetTemplate } from '../types/index';
import axios from 'axios';
import { mockTemplates } from '../mock/templates';

export const useAllTemplates = () => {
    const [templates, setTemplates] = useState<GetTemplate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await resourceService.getAllTemplates();
            setTemplates(data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.Message || 'Unable to load templates from API. Showing offline data.');
            } else {
                setError('Unable to load templates from API. Showing offline data.');
            }
            setTemplates(mockTemplates);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchTemplates();
    }, [fetchTemplates]);

    return { templates, loading, error, refreshTemplates: fetchTemplates };
};
