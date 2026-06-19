"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../shared/ui/button';

interface ResourceViewProps {
    templateId: number;
    template: { id: number; label: string; description: string } | null;
    onDelete: (id: number) => void;
    isDeleting: boolean;
}

export const ResourceView: React.FC<ResourceViewProps> = ({ 
    templateId, 
    template, 
    onDelete, 
    isDeleting 
}) => {
    const router = useRouter();

    return (
        <div className="max-w-3xl mx-auto my-12 p-6 space-y-6">
            
            {/* Header section */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">
                        {template?.label || "Untitled Template"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and review the details of this template
                    </p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                    Template Explorer
                </span>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* First card: System index ID */}
                <div className="p-6 bg-white shadow-sm rounded-2xl border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">System Index ID</h3>
                        <p className="text-3xl font-black font-mono text-gray-800 mt-3">
                            #{template?.id || '---'}
                        </p>
                    </div>
                    <div className="mt-4 text-xs text-gray-400">
                        The unique identifier of this template in the system database.
                    </div>
                </div>

                {/* Second card: Status */}
                <div className="p-6 bg-white shadow-sm rounded-2xl border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-bold text-emerald-600">Active & Ready</span>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-400">
                        The template is enabled and ready to link and manage properties.
                    </div>
                </div>
            </div>

            {/* Description card (full width) */}
            <div className="p-6 bg-white shadow-sm rounded-2xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Description</h3>
                <p className="text-gray-700 mt-2 bg-gray-50/70 p-5 rounded-xl border border-gray-50 min-h-20 leading-relaxed">
                    {template?.description || <span className="text-gray-300 italic">No description provided for this template.</span>}
                </p>
            </div>

            {/* Properties Management Button */}
            <div className="bg-white p-4 shadow-sm rounded-2xl border border-gray-100">
                <Button 
                    onClick={() => router.push(`/resourceTemplate/${templateId}/properties`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl w-full font-bold transition-all cursor-pointer shadow-sm border-0"
                >
                    Manage Properties
                </Button>
            </div>
            
            {/* Delete button */}
            <div className="bg-white p-4 shadow-sm rounded-2xl border border-gray-100">
                <Button 
                    onClick={() => onDelete(templateId)}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl disabled:bg-red-300 w-full font-bold transition-all cursor-pointer shadow-sm border-0"
                >
                    {isDeleting ? "Deleting..." : "Delete this template"}
                </Button>
            </div>
        </div>
    );
};