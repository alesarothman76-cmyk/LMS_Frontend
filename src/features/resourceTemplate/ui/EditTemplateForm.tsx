"use client";

import React from 'react';
import { Button } from '../../../shared/ui/button'; 

interface EditTemplateFormProps {
    formData: { label: string; description: string };
    setFormData: React.Dispatch<React.SetStateAction<{ label: string; description: string }>>;
    isUpdating: boolean;
    updateError: string | null;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onCancel: () => void;
}

export default function EditTemplateForm({
    formData,
    setFormData,
    isUpdating,
    updateError,
    onSubmit,
    onCancel
}: EditTemplateFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Field for Template Label */}
            <div>
                <label htmlFor="template-label" className="block text-sm font-bold text-gray-700 mb-2">Template Label *</label>
                <input
                    id="template-label"
                    type="text"
                    required
                    placeholder="Enter template label"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
            </div>

            {/* Field for Template Description */}
            <div>
                <label htmlFor="template-description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                    id="template-description"
                    rows={4}
                    placeholder="Enter template description"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            {/* Display Errors if any */}
            {updateError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium">
                    ⚠️ {updateError}
                </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-4 pt-4">
               <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 px-5 py-3 text-sm font-bold text-white bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-all cursor-pointer border-0 disabled:opacity-50"
                >
                    {isUpdating ? "Saving Changes..." : "Save Changes"}
                </Button>
                
                <Button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all cursor-pointer"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}