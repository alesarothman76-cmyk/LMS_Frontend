"use client";

import { useState } from 'react';
import { useMediaByItemId } from '../../../../features/media/hooks/useMediaByItem';

export default function MediaByItemPage() {
    const { mediaList, loading, error, fetchMediaByItem } = useMediaByItemId();
    const [itemIdInput, setItemIdInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedId = Number(itemIdInput.trim());
        if (!isNaN(parsedId) && parsedId > 0) {
            fetchMediaByItem(parsedId);
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-12 p-8 bg-white shadow-xl rounded-3xl border border-gray-100 text-right" dir="rtl">
            
            {/* Header */}
            <div className="border-b border-gray-100 pb-5 mb-6">
                <h1 className="text-xl font-black text-gray-900">Query media by Item ID</h1>
                <p className="text-xs text-gray-400 mt-1">Enter the asset or item ID to fetch all linked media files and documents.</p>
            </div>

            {/* Numeric search field */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                        <input
                            type="number"
                            min="1"
                            placeholder="Enter the item ID (e.g. 11)..."
                            value={itemIdInput}
                            onChange={(e) => setItemIdInput(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-left"
                            dir="ltr"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !itemIdInput.trim()}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold rounded-2xl text-xs transition-all shadow-sm whitespace-nowrap"
                    >
                        {loading ? 'Checking...' : 'Fetch media'}
                    </button>
                </div>
            </form>

            {/* Expected errors (such as server 404) */}
            {error && (
                <div className="p-4 bg-orange-50 text-orange-700 rounded-xl border border-orange-100 text-xs mb-4 font-medium">
                    ℹ️ {typeof error === 'string' ? error : JSON.stringify(error)}
                </div>
            )}

            {/* Loading placeholder */}
            {loading && <div className="text-center py-12 text-gray-400 animate-pulse text-sm font-medium">Checking relationships and fetching files...</div>}

            {/* Display returned files */}
            {!loading && mediaList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mediaList.map((media) => (
                        <div key={media.id} className="p-5 bg-gray-50/60 border border-gray-100/70 rounded-2xl flex flex-col justify-between hover:shadow-md hover:bg-white transition-all duration-200">
                            <div>
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-sm font-black text-gray-800 truncate flex-1">{media.fileName}</h3>
                                    <span className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-bold shrink-0">
                                        Media ID: #{media.id}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5 font-medium">
                                    <span className="text-gray-400">Alt description:</span> {media.altText || <span className="italic text-gray-300">None available</span>}
                                </p>
                            </div>

                            {/* Attached EAV values for returned data */}
                            {media.values && media.values.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                                    {media.values.map((v) => (
                                        <div key={v.id} className="text-[11px] text-gray-600 bg-white p-2 rounded-xl border border-gray-200/50 flex justify-between items-center">
                                            <span className="font-bold text-gray-400">Type: {v.type}</span>
                                            <span className="font-medium text-gray-700">{v.valueText}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Default screen */}
            {!loading && mediaList.length === 0 && !error && (
                <p className="text-xs text-gray-400 italic py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    {itemIdInput ? 'No media is linked to this ID.' : 'Enter an Item ID above to start fetching data.'}
                </p>
            )}
        </div>
    );
}