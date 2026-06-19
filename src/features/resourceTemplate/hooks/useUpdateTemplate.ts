import { useState } from 'react';
import { resourceService } from '../services/resourceService';
import { UpdateResourceTemplateDto } from '../types';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const useUpdateTemplate = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const router = useRouter();

    const update = async (templateId: number, data: UpdateResourceTemplateDto) => {
        setIsUpdating(true);
            setUpdateError(null);        try {
            const result = await resourceService.updateTemplate(templateId, data);
            if (result.success) {
                router.push(`/resourceTemplate/${templateId}/values`);
                router.refresh(); 
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setUpdateError(err.response?.data?.Message || "Failed to update template");
            } else {
                setUpdateError("Unexpected error occurred");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    return { update, isUpdating, updateError };
};