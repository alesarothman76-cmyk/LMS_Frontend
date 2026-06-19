"use client";

import React from 'react';
import { ResourceValueDto } from '../types';

interface EditMediaFormViewProps {
    fileName: string;
    setFileName: (value: string) => void;
    altText: string;
    setAltText: (value: string) => void;
    eavValues: ResourceValueDto[];
    handleEavTextChange: (index: number, newText: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string | null | object;
    successMessage: string | null;
    mediaId: number;
}

export const EditMediaFormView: React.FC<EditMediaFormViewProps> = ({
    fileName,
    setFileName,
    altText,
    setAltText,
    eavValues,
    handleEavTextChange,
    handleSubmit,
    loading,
    error,
    successMessage,
    mediaId
}) => {
    return (
        <div className="max-w-xl mx-auto p-6 bg-white border border-gray-100 rounded-3xl shadow-md text-right" dir="rtl">
            <h2 className="text-sm font-black text-gray-800 mb-5 pb-2 border-b border-gray-100">
                📝 Edit media file and associated EAV values (#{mediaId})
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Primary file name:</label>
                    <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-left font-mono"
                        dir="ltr"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Alternative text (Alt Text):</label>
                    <input
                        type="text"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        placeholder="Enter a descriptive file caption..."
                    />
                </div>

                {eavValues && eavValues.length > 0 && (
                    <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <span className="block text-xs font-black text-gray-600 mb-1">🗂️ Dynamic EAV metadata properties:</span>
                        {eavValues.map((value, idx) => (
                            <div key={value.id} className="bg-white p-3 rounded-xl border border-gray-200/60 shadow-sm">
                                <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1.5">
                                    <span>Property type: {value.type}</span>
                                    <span dir="ltr">Lang: {value.language}</span>
                                </div>
                                <input
                                    type="text"
                                    value={value.valueText}
                                    onChange={(e) => handleEavTextChange(idx, e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs font-medium">⚠️ {typeof error === 'string' ? error : 'Update failed, please verify the entered data.'}</div>}
                {successMessage && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-medium">✅ {successMessage}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving changes to server...' : 'Update media and properties'}
                </button>
            </form>
        </div>
    );
};