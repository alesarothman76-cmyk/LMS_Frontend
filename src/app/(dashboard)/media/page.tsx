"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAllMedia } from '../../../features/media/hooks/useAllMedia';

export default function MediaListPage() {
  const router = useRouter();
  const { mediaList, loading, error, refreshMedia } = useAllMedia();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="p-8 text-gray-500 animate-pulse">Loading media files...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-600 font-semibold">Media Library</p>
          <h1 className="text-3xl font-black text-gray-900 mt-3">All Media Files</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => void refreshMedia()}
            className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium cursor-pointer"
          >
            Update List
          </button>
          <button
            onClick={() => router.push('/media/create')}
            className="px-4 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold cursor-pointer"
          >
            Create New File
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-3xl border border-yellow-200 bg-yellow-50 text-yellow-700">
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
            <div
              key={media.id}
              className="flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <span className="text-xs font-mono font-bold bg-gray-50 text-gray-400 px-2 py-1 rounded-lg border border-gray-100">
                  #{media.id}
                </span>
                <h2 className="text-lg font-black text-gray-900 mt-4 line-clamp-1 break-all">
                  {media.fileName}
                </h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                  {media.altText ?? 'No description'}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-50 text-left">
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