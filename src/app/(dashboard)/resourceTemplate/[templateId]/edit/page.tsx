"use client";

import { useState, useEffect } from 'react';
import { useUpdateTemplate } from '../../../../../features/resourceTemplate/hooks/useUpdateTemplate';
import { resourceService } from '../../../../../features/resourceTemplate/services/resourceService';
import { useParams } from 'next/navigation';
import EditTemplateForm from '../../../../../features/resourceTemplate/ui/EditTemplateForm';

export default function EditTemplatePage() {
    const params = useParams();
    const templateId = Number(params.templateId);
    
    const [formData, setFormData] = useState({ label: '', description: '' });
    const [isLoadingData, setIsLoadingData] = useState(true);
    const { update, isUpdating, updateError } = useUpdateTemplate();

    useEffect(() => {
        const fetchCurrentData = async () => {
            try {
                const data = await resourceService.getTemplate(templateId);
                setFormData({
                    label: data.label || '',
                    description: data.description || ''
                });
            } catch (err) {
                console.error("failed to fetch original template data", err);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchCurrentData();
    }, [templateId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.label) return;
        await update(templateId, formData);
    };

    const handleCancel = () => {
        window.history.back();
    };

    if (isLoadingData) {
        return <div className="text-center my-32 font-bold text-gray-500">failed to load original template data...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto my-16 p-8 bg-white shadow-2xl rounded-3xl border border-gray-50">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-gray-900">Update Template</h1>
                <p className="text-gray-500 mt-2">modify the label or description of the template</p>
            </div>

            <EditTemplateForm 
                formData={formData}
                setFormData={setFormData}
                isUpdating={isUpdating}
                updateError={updateError}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
}