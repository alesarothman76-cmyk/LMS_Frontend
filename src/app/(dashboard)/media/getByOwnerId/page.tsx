"use client";

import { useEffect } from 'react';
import { useMediaByOwner } from '../../../../features/media/hooks/useMediaByOwner';

export default function MyMediaPage() {
    const { mediaList, loading, error, fetchMyMedia } = useMediaByOwner();

    // 💡 Automatically fetch files on page load for user convenience
    useEffect(() => {
        fetchMyMedia();
    }, [fetchMyMedia]);

    return (
        <div className="max-w-4xl mx-auto my-12 p-8 bg-white shadow-xl rounded-3xl border border-gray-100 text-right" dir="rtl">
            
            {/* Header */}
            <div className="border-b border-gray-100 pb-5 mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-xl font-black text-gray-900">My Media Files</h1>
                    <p className="text-xs text-gray-400 mt-1">Showing all files uploaded by your current account using the identity token.</p>
                </div>
                
                {/* Manual refresh button */}
                <button
                    onClick={fetchMyMedia}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs border border-gray-200 transition-all"
                >
                    {loading ? 'Updating...' : '🔄 Refresh list'}
                </button>
            </div>

            {/* Error and warning display */}
            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs mb-6 font-medium">
                    ⚠️ {error}
                </div>
            )}

            {/* Loading indicator */}
            {loading && (
                <div className="text-center py-12 text-gray-400 animate-pulse text-sm font-medium">
                    Verifying identity and fetching your files from the server...
                </div>
            )}

            {/* Current user's media list */}
            {!loading && mediaList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mediaList.map((media) => (
                        <div key={media.id} className="p-5 bg-gray-50/60 border border-gray-100/70 rounded-2xl flex flex-col justify-between hover:shadow-md hover:bg-white transition-all duration-200">
                            <div>
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-sm font-black text-gray-800 truncate flex-1">{media.fileName}</h3>
                                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-bold shrink-0">
                                        ID: #{media.id}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5 font-medium">
                                    <span className="text-gray-400">Description:</span> {media.altText || <span className="italic text-gray-300">No alt text provided</span>}
                                </p>
                            </div>

                            {/* Display attached EAV properties if available */}
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

            {/* Empty state if the account has no files */}
            {!loading && mediaList.length === 0 && !error && (
                <p className="text-xs text-gray-400 italic py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    You have not uploaded any media files to the system under this account yet.
                </p>
            )}
        </div>
    );
}