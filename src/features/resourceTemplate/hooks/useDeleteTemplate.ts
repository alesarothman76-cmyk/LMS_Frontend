// src/features/resources/hooks/useDeleteTemplate.ts
import { useState } from 'react';
import { resourceService } from '../services/resourceService';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';

export const useDeleteTemplate = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const router = useRouter(); 

    const remove = async (templateId: number) => {
        if (!window.confirm("Are you sure you want to delete this template permanently?")) return;

        setIsDeleting(true);
        setDeleteError(null);
        try {
            const result = await resourceService.deleteTemplate(templateId);
            if (result.success) {
                router.push('/templates'); 
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setDeleteError(err.response?.data?.Message || "Failed to delete template");
            } else {
                setDeleteError("An unexpected error occurred");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return { remove, isDeleting, deleteError };
};