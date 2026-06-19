"use client";

import React from 'react';
import { MimeTypeMediaResponse } from '../types'; 

interface FilterOption {
    label: string;
    value: string;
}

interface MediaFilterViewProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterOptions: FilterOption[];
    handleSearch: (e: React.FormEvent) => void;
    handleTagClick: (value: string) => void;
    loading: boolean;
    error: string | null;
    mediaList: MimeTypeMediaResponse[];
}

export const MediaFilterView: React.FC<MediaFilterViewProps> = ({
    searchQuery,
    setSearchQuery,
    filterOptions,
    handleSearch,
    handleTagClick,
    loading,
    error,
    mediaList
}) => {
    return (
        <div className="max-w-4xl mx-auto my-12 p-8 bg-white shadow-xl rounded-3xl border border-gray-100 text-right">
            {/* Header */}
            <div className="border-b border-gray-100 pb-5 mb-6">
                <h1 className="text-xl font-black text-gray-900">Search media by file type</h1>
                <p className="text-xs text-gray-400 mt-1">Type the full MimeType or choose a quick tag to fetch files from the server.</p>
            </div>

            {/* Search field */}
            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Example: image/png or application/pdf..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all pl-10"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !searchQuery.trim()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold rounded-2xl text-xs transition-all shadow-sm shadow-blue-100 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading ? 'Searching...' : 'Search now'}
                    </button>
                </div>
            </form>

            {/* Quick filter tags */}
            <div className="flex gap-2 mb-8 justify-start flex-wrap items-center">
                <span className="text-xs font-bold text-gray-400 ml-1">Popular tags:</span>
                {filterOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => handleTagClick(option.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            searchQuery === option.value
                                ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-sm'
                                : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Error display */}
            {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs mb-4 font-medium">⚠️ {error}</div>}

            {/* Loading state */}
            {loading && <div className="text-center py-12 text-gray-400 animate-pulse text-sm font-medium">Fetching matching files from the real server...</div>}

            {/* Results display */}
            {!loading && mediaList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mediaList.map((media) => (
                        <div key={media.id} className="p-5 bg-gray-50/60 border border-gray-100/70 rounded-2xl flex flex-col justify-between hover:shadow-md hover:bg-white transition-all duration-200">
                            <div>
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-sm font-black text-gray-800 truncate flex-1">{media.fileName}</h3>
                                    <span className="text-[10px] font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold shrink-0">
                                        #{media.id}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5 font-medium">
                                    <span className="text-gray-400">Description:</span> {media.altText || <span className="italic text-gray-300">No alt text available</span>}
                                </p>
                            </div>

                            {/* Display attached EAV values array if available */}
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

            {/* No results */}
            {!loading && mediaList.length === 0 && !error && (
                <p className="text-xs text-gray-400 italic py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    {searchQuery ? 'No files matching this type were found.' : 'Enter a file type in the search field or choose a quick tag to begin.'}
                </p>
            )}
        </div>
    );
};