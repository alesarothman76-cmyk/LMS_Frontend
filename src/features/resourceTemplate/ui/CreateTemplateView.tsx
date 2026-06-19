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
        <div className="max-w-2xl mx-auto my-16 p-8 bg-white shadow-2xl rounded-3xl border border-gray-50">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-gray-900">Create New Template</h1>
                <p className="text-gray-500 mt-2">حدد المسمى والوصف لبناء هيكل الموارد الجديد</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Field for Template Label */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Template Label *</label>
                    <Input
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

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Properties</label>
                    <TemplatePropertySelector onChange={onSelectedPropertiesChange} />
                    <p className="text-xs text-gray-500 mt-2">
                        اختر الخصائص التي تريد ربطها بالقالب. يمكنك تعديل ترتيب العرض والتسمية البديلة لكل خاصية بعد الاختيار.
                    </p>
                </div>

                {/* Display Errors if any */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium">
                        ⚠️ {error}
                    </div>
                )}

                {/* Control Buttons */}
                <div className="flex gap-4 pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-2xl shadow-lg shadow-blue-200 disabled:bg-blue-300 disabled:shadow-none transition-all"
                    >
                        {isSubmitting ? "Saving Template..." : "Create Template"}
                    </Button>
                    
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};