"use client";

import React from 'react';
import Link from 'next/link';

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
    mediaList,
    loading,
    error,
    onRefresh,
    onCreateRedirect
}: MediaListViewProps) {
    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-gray-900">All Media Files</h1>
                <div className="flex gap-3">
                    <button onClick={onRefresh} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200">
                        Refresh
                    </button>
                    <button onClick={onCreateRedirect} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                        Create New
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-6 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200">
                    {error}
                </div>
            )}

            {mediaList.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    No media files available.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mediaList.map((media) => (
                        <div key={media.id} className="flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <span className="text-xs font-mono bg-gray-50 text-gray-400 px-2 py-1 rounded-lg border border-gray-100">
                                    #{media.id}
                                </span>
                                <h2 className="text-lg font-black text-gray-900 mt-4 break-all line-clamp-1">
                                    {media.fileName}
                                </h2>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                    {media.altText ?? 'No description'}
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-50">
                                <Link
                                    href={`/media/${media.id}/get`}
                                    className="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}