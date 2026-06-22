"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useMediaFilter } from '../hooks/useMediaByMimeType';

export interface MediaItem {
    id: number | string;
    fileName: string;
    altText?: string | null;
}

interface MediaListViewProps {
    mediaList: MediaItem[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
    onCreateRedirect: () => void;
}

export function MediaListView({
    mediaList: initialMediaList,
    loading: initialLoading,
    error: initialError,
    onRefresh,
    onCreateRedirect
}: MediaListViewProps) {
    const { mediaList: filteredMedia, loading: filterLoading, error: filterError, filterByMimeType } = useMediaFilter();
    const [searchQuery, setSearchQuery] = useState('');

    const isSearching = searchQuery.trim() !== '' || filterLoading || filterError !== null;
    const mediaList = isSearching ? filteredMedia : initialMediaList;
    const loading = isSearching ? filterLoading : initialLoading;
    const error = isSearching ? filterError : initialError;

    const filterOptions = [
        { label: 'Images (PNG)', value: 'image/png' },
        { label: 'Images (JPEG)', value: 'image/jpeg' },
        { label: 'Documents (PDF)', value: 'application/pdf' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            void filterByMimeType(searchQuery.trim());
        }
    };

    const handleTagClick = (value: string) => {
        setSearchQuery(value);
        void filterByMimeType(value);
    };

    return (
        <div className="max-w-6xl mx-auto my-12 p-8 bg-stone-900/10 backdrop-blur-sm rounded-3xl shadow-2xl shadow-stone-950/30 border border-stone-800/40">
            <div className="mb-10 p-6 bg-stone-950/20 shadow-xl rounded-2xl border border-stone-800/60 text-right">
                <div className="border-b border-stone-800/50 pb-4 mb-5">
                    <h2 className="text-base font-black text-stone-200">Search media by file type</h2>
                    <p className="text-xs text-stone-400 mt-1">Type the full MimeType or choose a quick tag to fetch files from the server.</p>
                </div>

                <form onSubmit={handleSearch} className="mb-4">
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Example: image/png or application/pdf..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-600 focus:bg-stone-950/80 transition-all pl-10 text-stone-200 placeholder:text-stone-500"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs font-bold cursor-pointer"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !searchQuery.trim()}
                            className="px-6 py-3 bg-amber-950 border border-amber-800 hover:bg-stone-900 disabled:bg-stone-800 text-stone-100 disabled:text-stone-500 font-bold rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? 'Searching...' : 'Search now'}
                        </button>
                    </div>
                </form>

                <div className="flex gap-2 justify-start flex-wrap items-center">
                    <span className="text-xs font-bold text-stone-400 ml-1">Popular tags:</span>
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleTagClick(option.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                searchQuery === option.value
                                    ? 'bg-amber-950/40 border-amber-800 text-amber-300 shadow-sm'
                                    : 'bg-stone-900/50 border-stone-700 text-stone-400 hover:bg-stone-800'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-stone-800/50 pb-6 text-right w-full">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">All Media Files</h1>
                    <p className="text-stone-400 text-xs mt-1 font-medium">Manage, view, and explore all uploaded media records.</p>
                </div>
                <div className="flex gap-3 self-end sm:self-auto">
                    <button 
                        onClick={onRefresh} 
                        className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700 font-bold text-xs transition-colors cursor-pointer shadow-sm"
                    >
                        🔄 Refresh List
                    </button>
                    <button 
                        onClick={onCreateRedirect} 
                        className="px-4 py-2.5 rounded-xl bg-amber-950 border border-amber-800 text-stone-100 hover:bg-stone-900 font-bold text-xs transition-colors cursor-pointer shadow-sm"
                    >
                        + Create New Media
                    </button>
                </div>
            </div>

            {/* Error Handling */}
            {error && (
                <div className="p-4 mb-6 rounded-2xl bg-red-950/20 text-red-300 border border-red-800/50 text-sm font-bold text-right shadow-sm flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={onRefresh} className="text-xs bg-red-900 text-white hover:bg-red-950 px-3 py-1.5 rounded-lg cursor-pointer transition">Retry</button>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="max-w-6xl mx-auto py-16 flex justify-center items-center">
                    <div className="flex flex-col items-center gap-3 text-stone-300 text-sm font-bold tracking-wide animate-pulse">
                        <span className="text-2xl">⏳</span> Loading media files...
                    </div>
                </div>
            )}

            {/* Empty State vs Grid List */}
            {!loading && mediaList.length === 0 ? (
                <div className="p-16 text-center bg-stone-950/20 backdrop-blur-sm rounded-2xl border-2 border-dashed border-stone-700/60 flex flex-col items-center justify-center gap-3">
                    <span className="text-4xl">🗂️</span>
                    <h3 className="text-stone-200 font-black text-base">No media files available</h3>
                    <p className="text-stone-400 text-xs max-w-sm">There are no media records linked or found in the database. You can add new media by clicking the button above.</p>
                </div>
            ) : (
                !loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mediaList.map((media) => (
                            <div key={media.id} className="flex flex-col justify-between p-6 bg-stone-950/30 backdrop-blur-sm border border-stone-800/40 rounded-2xl shadow-sm hover:shadow-md hover:border-stone-700 transition-all text-right">
                                <div>
                                    <h2 className="text-base font-black text-stone-200 break-all line-clamp-1" title={media.fileName}>
                                        {media.fileName}
                                    </h2>
                                    <p className="text-xs text-stone-400 mt-2.5 line-clamp-3 leading-relaxed" title={media.altText ?? ''}>
                                        {media.altText ?? 'No description provided'}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-stone-800/30 flex gap-2">
                                    <Link
                                        href={`/media/${media.id}/get`}
                                        className="inline-flex items-center justify-center flex-1 px-5 py-3 text-xs font-black text-stone-100 bg-stone-800 rounded-xl hover:bg-stone-700 transition-colors tracking-wide border border-stone-700/50"
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        href={`/media/${media.id}/edit`}
                                        className="inline-flex items-center justify-center px-5 py-3 text-xs font-black text-amber-100 bg-amber-950/60 rounded-xl hover:bg-amber-900/60 transition-colors tracking-wide border border-amber-800/50"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}