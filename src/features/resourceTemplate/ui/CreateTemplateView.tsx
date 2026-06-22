"use client";

import React from 'react';
import { TemplatePropertySelector } from './TemplatePropertySelector';
import { PropertyToTemplateInput } from '../types';
import { Input } from '../../../shared/ui/input'; 
import { Button } from '../../../shared/ui/button';

interface CreateTemplateViewProps {
    formData: { label: string; description: string };
    setFormData: React.Dispatch<React.SetStateAction<{ label: string; description: string }>>;
    onSelectedPropertiesChange: (properties: PropertyToTemplateInput[]) => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    error: string | null;
    onCancel: () => void;
}

export const CreateTemplateView: React.FC<CreateTemplateViewProps> = ({
    formData,
    setFormData,
    onSelectedPropertiesChange,
    onSubmit,
    isSubmitting,
    error,
    onCancel
}) => {
    return (
        <div className="max-w-3xl mx-auto my-16 p-8 bg-white shadow-xl shadow-zinc-200/50 rounded-3xl border border-zinc-100">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Create New Template</h1>
                <p className="text-zinc-500 mt-3">Define the label, description, and properties for your new resource structure</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-8">
                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">Template Label <span className="text-red-500">*</span></label>
                    <Input
                        type="text"
                        required
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all outline-none"
                        placeholder="e.g. Course Template"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">Description</label>
                    <textarea
                        rows={4}
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all outline-none resize-none"
                        placeholder="Write a brief description..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">Template Properties</label>
                    <TemplatePropertySelector onChange={onSelectedPropertiesChange} />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 pt-6 border-t border-zinc-100">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-6 rounded-2xl shadow-lg shadow-zinc-200 disabled:opacity-50 disabled:shadow-none transition-all border-0"
                    >
                        {isSubmitting ? "Saving..." : "Create Template"}
                    </Button>
                    
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-2xl transition-all border-0"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};