// src/features/resources/hooks/useCreateTemplate.ts
import { useState } from 'react';
import { resourceService } from '../services/resourceService';
import { CreateResourceTemplateDto } from '../types';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const useCreateTemplate = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const create = async (data: CreateResourceTemplateDto) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const payload: CreateResourceTemplateDto = {
                label: data.label,
                description: data.description,
                propertyIds: data.propertyIds ?? [],
                propertyLinks: data.propertyLinks ?? [],
            };

            const result = await resourceService.createTemplate(payload);

            if (result?.success) {
                if (data.propertyLinks && data.propertyLinks.length > 0) {
                    await resourceService.addPropertiesToTemplate(result.id, data.propertyLinks);
                }

                router.push(`/resourceTemplate/${result.id}/properties`);
            } else {
                setError("Failed to create template: Operation unsuccessful.");
            }
        }  catch (err: unknown) {
    if (axios.isAxiosError(err)) {
        console.log("Full error response:", err.response);
        console.log("Status:", err.response?.status);
        console.log("Data:", err.response?.data);
        const message =
            err.response?.data?.message ||
            err.response?.data?.Message ||
            "Failed to create template";
        setError(message);
    } else {
        console.log("Non-axios error:", err);
        setError("An unexpected error occurred. Please try again.");
    }
} finally {
            setIsSubmitting(false);
        }
    };

    return { create, isSubmitting, error };
};