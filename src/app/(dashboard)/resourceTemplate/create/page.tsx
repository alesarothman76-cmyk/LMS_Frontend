// src/app/resourceTemplate/create/page.tsx
"use client";

import { useState } from 'react';
import { useCreateTemplate } from '../../../../features/resourceTemplate/hooks/useCreateTemplate';

export default function CreateTemplatePage() {
    const [formData, setFormData] = useState({ label: '', description: '' });
    const { create, issubmitting, error } = useCreateTemplate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.label) return;
        await create(formData);
    };

    return (
        <div className="max-w-2xl mx-auto my-16 p-8 bg-white shadow-2xl rounded-3xl border border-gray-50">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-gray-900">Create New Template</h1>
                <p className="text-gray-500 mt-2">حدد المسمى والوصف لبناء هيكل الموارد الجديد</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field for Template Label */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Template Label *</label>
                    <input
                        type="text"
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                        placeholder="مثلاً: Course Template أو User Profile"
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
                        placeholder="اكتب وصفاً موجزاً عن الغرض من هذا القالب..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* Display Errors if any */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium">
                        ⚠️ {error}
                    </div>
                )}

                {/* Control Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={issubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 disabled:bg-blue-300 disabled:shadow-none transition-all"
                    >
                        {issubmitting ? "Saving Template..." : "Create Template"}
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