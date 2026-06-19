"use client";

import React from 'react';

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
                <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 disabled:bg-emerald-300 transition-all cursor-pointer"
                >
                    {isUpdating ? "Saving Changes..." : "Save Changes"}
                </button>
                
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}