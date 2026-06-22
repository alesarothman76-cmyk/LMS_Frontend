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
        <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-zinc-100 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                        {template?.label || "Untitled Template"}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-2 font-medium">
                        Template Explorer & Management
                    </p>
                </div>
                <button
                    onClick={() => router.push('/resourceTemplate')}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all text-sm self-start sm:self-auto cursor-pointer border-0"
                >
                    &larr; Back to Templates
                </button>
            </div>

            {/* تم إزالة System ID والإبقاء على Status فقط ليأخذ العرض بالكامل بشكل مرتب */}
            <div className="grid grid-cols-1 gap-6">
                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</h3>
                        <div className="mt-4 flex items-center gap-3">
                            <span className="w-3 h-3 bg-zinc-800 rounded-full animate-pulse"></span>
                            <span className="text-base font-bold text-zinc-800">Active & Ready</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Description</h3>
                <p className="text-zinc-700 leading-relaxed font-medium">
                    {template?.description || <span className="text-zinc-400 italic">No description provided.</span>}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-100">
                <Button 
                    onClick={() => router.push(`/resourceTemplate/${templateId}/properties`)}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white p-4 rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-zinc-200 border-0"
                >
                    Manage Properties
                </Button>
                
                <Button 
                    onClick={() => onDelete(templateId)}
                    disabled={isDeleting}
                    className="sm:w-1/3 bg-red-50 hover:bg-red-100 text-red-600 p-4 rounded-xl disabled:opacity-50 font-bold transition-all cursor-pointer border border-red-100"
                >
                    {isDeleting ? "Deleting..." : "Delete Template"}
                </Button>
            </div>
        </div>
    );
};