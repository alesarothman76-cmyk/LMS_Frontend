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
    onCreateRedirect: () => void;
}

export const TemplateListView: React.FC<TemplateListViewProps> = ({
    templates,
    loading,
    error,
    onRefresh,
    onViewTemplate,
    onCreateRedirect
}) => {
    // Standard loading state
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
                <div className="p-8 text-gray-500 animate-pulse">Loading templates...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-blue-600 font-semibold">Resource Templates</p>
                    <h1 className="text-3xl font-black text-gray-900 mt-3">All Resource Templates</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={onRefresh}
                        className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition border-0 font-medium cursor-pointer"
                    >
                        Refresh list
                    </Button>
                    <Button
                        onClick={onCreateRedirect}
                        className="px-4 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition border-0 font-semibold cursor-pointer"
                    >
                        Create new template
                    </Button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="p-4 mb-6 rounded-3xl border border-yellow-200 bg-yellow-50 text-yellow-700">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && templates.length === 0 && (
                <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    No templates available.
                </div>
            )}

            {/* Data Cards Grid */}
            {!loading && templates.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div 
                            key={template.id} 
                            className="flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div>
                                {/* Template Name (Label) */}
                                <h2 className="text-lg font-black text-gray-900 line-clamp-1">
                                    {template.label}
                                </h2>
                                
                                {/* Template Description */}
                                <p className="text-sm text-gray-600 mt-4 line-clamp-3 h-15 leading-relaxed">
                                    {template.description || "No description provided for this template."}
                                </p>
                            </div>

                            {/* View Button */}
                            <div className="mt-6 pt-4 border-t border-gray-50 text-left">
                                <Button
                                    onClick={() => onViewTemplate(template.id)}
                                    className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 border-0 cursor-pointer transition w-full justify-center"
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};