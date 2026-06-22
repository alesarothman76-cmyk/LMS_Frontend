"use client";

import { useRouter } from 'next/navigation';
import { useAllTemplates } from '../../../features/resourceTemplate/hooks/useAllTemplates';
import { TemplateListView } from '../../../features/resourceTemplate/ui/TemplateListView';

export default function ResourceTemplateListPage() {
    const { templates, loading, error, refreshTemplates } = useAllTemplates();
    const router = useRouter();

    const handleRefresh = () => {
        void refreshTemplates();
    };

    const handleViewTemplate = (id: number | string) => {
        router.push(`/resourceTemplate/${id}/get`);
    };

    const handleCreateRedirect = () => {
        router.push('/resourceTemplate/create');
    };

    const handleUpdateRedirect = (id: number | string)  => {
        router.push(`/resourceTemplate/${id}/edit`);
    };

    return (
        <TemplateListView 
            templates={templates}
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
            onViewTemplate={handleViewTemplate}
            onEditTemplate={handleUpdateRedirect}
            onCreateRedirect={handleCreateRedirect}
        />
    );
}