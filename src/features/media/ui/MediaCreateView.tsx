"use client";

import React, { useState, useEffect } from 'react';
import { itemApi } from '../../../features/items/api/itemApi';
import { ItemDto } from '../../../features/items/types';

export interface ValueItem {
    propertyId: number | string;
    valueText: string;
    language: string;
}

export interface MediaData {
    itemId: string;
    fileName: string;
    altText: string;
    ownerId: string;
}

interface MediaCreateViewProps {
    mediaData: MediaData;
    setMediaData: React.Dispatch<React.SetStateAction<MediaData>>;
    valuesList: ValueItem[];
    handleValueChange: (index: number, field: keyof ValueItem, value: unknown) => void;
    addNewValueField: () => void;
    removeValueField: (index: number) => void;
    isLoading: boolean;
    error: string | null;
    onSubmit: (e: React.FormEvent) => void;
    onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // إضافة خاصية معالجة رفع الملف
}

export const MediaCreateView: React.FC<MediaCreateViewProps> = ({
    mediaData,
    setMediaData,
    valuesList,
    handleValueChange,
    addNewValueField,
    removeValueField,
    isLoading,
    error,
    onSubmit,
    onFileChange
}) => {
    const [items, setItems] = useState<ItemDto[]>([]);
    const [itemsLoading, setItemsLoading] = useState(true);
    const [itemsError, setItemsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await itemApi.GetAllItems();
                setItems(data);
            } catch {
                setItemsError("Failed to load items");
            } finally {
                setItemsLoading(false);
            }
        };
        void fetchItems();
    }, []);

    return (
        <div className="max-w-4xl mx-auto my-12 p-8 bg-stone-50 shadow-xl shadow-stone-200/40 rounded-3xl border border-stone-100">
            {/* Header */}
            <div className="mb-8 text-right border-b border-stone-200 pb-6">
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">Add Media and Dynamic Properties (EAV)</h1>
                <p className="text-stone-500 text-xs mt-1 font-medium">Link media files and save custom values for the current structure.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium text-right">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">

                {/* 1. Media core data section */}
                <div className="bg-white p-6 border border-stone-200 rounded-2xl text-right shadow-sm shadow-stone-100/50">
                    <h2 className="text-sm font-black text-stone-700 mb-4">📌 Media Core Data</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Item Selector */}
                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-2">Item *</label>
                            {itemsLoading ? (
                                <div className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-400 text-right animate-pulse">
                                    Loading items...
                                </div>
                            ) : itemsError ? (
                                <div className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500 text-right">
                                    {itemsError}
                                </div>
                            ) : (
                                <select
                                    required
                                    className="w-full p-3 bg-white border border-stone-300 rounded-xl outline-none text-right text-sm focus:border-stone-600 transition-colors cursor-pointer"
                                    value={mediaData.itemId}
                                    onChange={e => setMediaData({ ...mediaData, itemId: e.target.value })}
                                >
                                    <option value="">-- Select an Item --</option>
                                    {items.map(item => (
                                        <option key={item.id} value={String(item.id)}>
                                            #{item.id} — Template {item.templateId}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-2">Media File Name *</label>
                            <input
                                type="text"
                                required
                                placeholder="book-cover.jpg or file.pdf"
                                className="w-full p-3 bg-white border border-stone-300 rounded-xl outline-none text-right text-sm focus:border-stone-600 transition-colors"
                                value={mediaData.fileName}
                                onChange={e => setMediaData({ ...mediaData, fileName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-2">Alt Text</label>
                            <input
                                type="text"
                                placeholder="Custom description for the file or image"
                                className="w-full p-3 bg-white border border-stone-300 rounded-xl outline-none text-right text-sm focus:border-stone-600 transition-colors"
                                value={mediaData.altText}
                                onChange={e => setMediaData({ ...mediaData, altText: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-2">Owner ID</label>
                            <input
                                type="text"
                                placeholder="Enter the current owner ID"
                                className="w-full p-3 bg-white border border-stone-300 rounded-xl outline-none text-right text-sm focus:border-stone-600 transition-colors"
                                value={mediaData.ownerId}
                                onChange={e => setMediaData({ ...mediaData, ownerId: e.target.value })}
                            />
                        </div>

                        {/* Upload File Input Field */}
                        <div className="md:col-span-2 border-t border-stone-100 pt-4 mt-2">
                            <label className="block text-xs font-bold text-stone-700 mb-2">Upload Media File</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    onChange={onFileChange}
                                    className="w-full text-sm text-stone-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 file:cursor-pointer bg-white border border-stone-200 rounded-xl cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Dynamic values section */}
                <div className="bg-stone-100/30 p-6 border border-stone-200/80 rounded-2xl text-right shadow-sm shadow-stone-100/50">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-black text-stone-800">⚙️ Dynamic Property Values (Values List)</h2>
                        <button
                            type="button"
                            onClick={addNewValueField}
                            className="bg-stone-700 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer border-0"
                        >
                            + Add New Value Field
                        </button>
                    </div>

                    {valuesList.map((valueItem, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-white border border-stone-200/80 rounded-xl shadow-sm mb-3 items-end">
                            <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-1.5">Property ID</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs outline-none focus:border-stone-600 text-center font-bold text-stone-800"
                                    value={valueItem.propertyId || ''}
                                    onChange={e => handleValueChange(index, 'propertyId', e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-bold text-stone-600 mb-1.5">Value Text</label>
                                <input
                                    type="text"
                                    placeholder="Actual value text"
                                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs outline-none focus:border-stone-600 text-right text-stone-800"
                                    value={valueItem.valueText}
                                    onChange={e => handleValueChange(index, 'valueText', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-1.5">Language</label>
                                <input
                                    type="text"
                                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs outline-none focus:border-stone-600 text-center text-stone-800"
                                    value={valueItem.language}
                                    onChange={e => handleValueChange(index, 'language', e.target.value)}
                                />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    disabled={valuesList.length === 1}
                                    onClick={() => removeValueField(index)}
                                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-xs disabled:opacity-30 transition-colors cursor-pointer border-0"
                                >
                                    Remove Field
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-stone-800 hover:bg-stone-900 text-white font-black py-4 rounded-xl shadow-md disabled:bg-stone-200 disabled:text-stone-400 transition-all text-sm cursor-pointer border-0 tracking-wide"
                    >
                        {isLoading ? "Processing and saving media..." : "Save media and full data"}
                    </button>
                </div>
            </form>
        </div>
    );
};