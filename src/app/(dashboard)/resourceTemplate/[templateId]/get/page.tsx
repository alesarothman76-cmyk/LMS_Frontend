// app/resource-values/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { useTemplateValues } from '../../../../../features/resourceTemplate/hooks/useTemplateValues';
import { useDeleteTemplate } from '../../../../../features/resourceTemplate/hooks/useDeleteTemplate';
import { ResourceView } from '../../../../../features/resourceTemplate/ui/TemplateDetails';

export default function ResourceValuesPage() {
    const params = useParams();
    const templateId = params?.templateId ? Number(params.templateId) : 0;

    const { template, loading, error } = useTemplateValues(templateId);
    const { remove, isDeleting } = useDeleteTemplate();

    if (!templateId || isNaN(templateId)) {
        return <div className="p-8 text-center text-gray-500">Initializing Router...</div>;
    }

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading template details...</div>;
    if (error) return <div className="p-4 mx-auto max-w-2xl bg-red-50 text-red-700 rounded-xl border border-red-100">{error}</div>;

    return (
        <ResourceView 
            templateId={templateId}
            template={template}
            onDelete={remove}
            isDeleting={isDeleting}
        />
    );
}