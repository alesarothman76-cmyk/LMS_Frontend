"use client";

import { useParams } from 'next/navigation';
import { useTemplateValues } from '../../../../features/resourceTemplate/hooks/useTemplateValues';
import { useDeleteTemplate } from '../../../../features/resourceTemplate/hooks/useDeleteTemplate';

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
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white shadow-sm rounded-3xl border border-gray-100">
            <div className="border-b border-gray-100 pb-5 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md">
                    Template Explorer
                </span>
                <h1 className="text-2xl font-black text-gray-900 mt-2">
                    {template?.label || "Untitled Template"}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    System Database Index: <span className="font-mono font-bold text-gray-600">#{template?.id}</span>
                </p>
            </div>

            <div className="space-y-5">
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Description</h3>
                    <p className="text-gray-700 mt-1.5 bg-gray-50 p-4 rounded-2xl border border-gray-100 min-h-[80px]">
                        {template?.description || <span className="text-gray-300 italic">No description provided for this template.</span>}
                    </p>
                </div>
            </div>
            <button 
    onClick={() => remove(templateId)}
    disabled={isDeleting}
    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl disabled:bg-red-300"
>
    {isDeleting ? "Deleting..." : "Delete this template"}
</button>
        </div>

    );
}