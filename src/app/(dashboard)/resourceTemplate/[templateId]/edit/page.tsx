"use client";

import { useState, useEffect } from 'react';
import { useUpdateTemplate } from '../../../../features/resourceTemplate/hooks/useUpdateTemplate';
import { resourceService } from '../../../../features/resourceTemplate/services/resourceService';
import { useParams } from 'next/navigation';

export default function EditTemplatePage() {
    const params = useParams();
    const templateId = Number(params.templateId);
    
    const [formData, setFormData] = useState({ label: '', description: '' });
    const [isLoadingData, setIsLoadingData] = useState(true);
    const { update, isUpdating, updateError } = useUpdateTemplate();

    useEffect(() => {
        const fetchCurrentData = async () => {
            try {
                const data = await resourceService.getTemplate(templateId);
                setFormData({
                    label: data.label || '',
                    description: data.description || ''
                });
            } catch (err) {
                console.error("failed to fetch original template data", err);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchCurrentData();
    }, [templateId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.label) return;
        await update(templateId, formData);
    };

    if (isLoadingData) {
        return <div className="text-center my-32 font-bold text-gray-500">failed to load original template data...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto my-16 p-8 bg-white shadow-2xl rounded-3xl border border-gray-50">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-gray-900">Update Template</h1>
                <p className="text-gray-500 mt-2">modify the label or description of the template</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field for Template Label */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Template Label *</label>
                    <input
                        type="text"
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    />
                </div>

                {/* Field for Template Description */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea
                        rows={4}
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
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 disabled:bg-emerald-300 transition-all"
                    >
                        {isUpdating ? "Saving Changes..." : "Save Changes"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}