import { useState } from 'react';
import { resourceService } from '../services/resourceService';
import { AddPropertiesToTemplateRequest } from '../types';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const useAddProperties = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const router = useRouter();

    const sendProperties = async (templateId: number, data: AddPropertiesToTemplateRequest) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const result = await resourceService.addPropertiesToTemplate(templateId, data);
            if (result.success) {
                router.push(`/resourceTemplate/${templateId}/get`);
                router.refresh();
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setSubmitError(err.response?.data?.message || "failed to add properties to template");
            } else {
                setSubmitError("An unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return { sendProperties, isSubmitting, submitError };
};