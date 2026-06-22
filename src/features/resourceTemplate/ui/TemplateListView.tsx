"use client";

import React from 'react';
import { Button } from '../../../shared/ui/button'; 

// Data interface definition
export interface TemplateItem {
    id: number | string;
    label: string;
    description: string;
}

interface TemplateListViewProps {
    templates: TemplateItem[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
    onViewTemplate: (id: number | string) => void;
    onEditTemplate: (id: number | string) => void;
    onCreateRedirect: () => void;
}

export const TemplateListView: React.FC<TemplateListViewProps> = ({
    templates,
    loading,
    error,
    onRefresh,
    onViewTemplate,
    onEditTemplate,
    onCreateRedirect
}) => {
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto my-12 p-12 bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 text-center">
                <div className="text-zinc-500 font-medium animate-pulse">Loading templates...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
                <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Resource Templates</p>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight">All Templates</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={onRefresh}
                        className="px-5 py-3 rounded-2xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-all border-0 font-bold cursor-pointer"
                    >
                        Refresh
                    </Button>
                    <Button
                        onClick={onCreateRedirect}
                        className="px-6 py-3 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all border-0 font-bold shadow-lg shadow-zinc-200 cursor-pointer"
                    >
                        + New Template
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-8 rounded-2xl border border-red-200 bg-red-50 text-red-700 font-medium">
                    {error}
                </div>
            )}

            {!loading && templates.length === 0 && (
                <div className="p-16 text-center text-zinc-500 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
                    <p className="font-medium text-lg">No templates available</p>
                    <p className="text-sm mt-2 text-zinc-400">Click the button above to create one.</p>
                </div>
            )}

            {!loading && templates.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div 
                            key={template.id} 
                            className="flex flex-col justify-between p-7 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 group"
                        >
                            <div>
                                <h2 className="text-xl font-black text-zinc-900 line-clamp-1 group-hover:text-zinc-700 transition-colors">
                                    <span className="text-zinc-400 text-base font-normal mr-2">label:</span>
                                    {template.label}
                                </h2>
                                <p className="text-sm text-zinc-500 mt-3 line-clamp-3 leading-relaxed">
                                    <span className="text-zinc-400 font-medium mr-2 block sm:inline">description:</span>
                                    {template.description || "No description provided for this template."}
                                </p>
                            </div>

                            <div className="mt-8 pt-5 border-t border-zinc-100 flex gap-3">
                                <Button
                                    onClick={() => onViewTemplate(template.id)}
                                    className="flex-1 px-5 py-3 text-sm font-bold text-zinc-900 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-all cursor-pointer border-0"
                                >
                                    View Details
                                </Button>
                                <Button
                                    onClick={() => onEditTemplate(template.id)}
                                    className="flex-1 px-5 py-3 text-sm font-bold text-white bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-all cursor-pointer border-0"
                                >
                                    Edit
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};