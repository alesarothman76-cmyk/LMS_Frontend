// src/features/resources/hooks/useCreateTemplate.ts
import { useState } from 'react';
import { resourceService } from '../services/resourceService';
import { CreateResourceTemplateDto } from '../types';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const useCreateTemplate = () => {
    const [issubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const create = async (data: CreateResourceTemplateDto) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await resourceService.createTemplate(data);
            if (result.success) {
                router.push(`/resourceTemplate/${result.id}/properties`);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.Message || "Failed to load template data");
            } else {
                setError("An unexpected error occurred");
            }        } finally {
            setIsSubmitting(false);
        }
    };

    return { create, issubmitting, error };
};