"use client";

import React from 'react';

export interface MetadataItem {
    propertyLabel: string;
    valueText: string;
}

export interface MediaDetail {
    id: number;
    fileName?: string;
    mimeType?: string;
    storagePath?: string;
    metadata?: MetadataItem[];
}

interface ResourceValuesViewProps {
    media: MediaDetail | null;
    mediaId: number;
    loading: boolean;
    error: string | null;
    imageSrc: string | null;
    imageLoading: boolean;
    imageFetchError: boolean;
    isImage: boolean;
    isFileDownloading: boolean;
    deletingId: number | null;
    uploading: boolean;
    deleteError: string | null;
    uploadError: string | null;
    uploadedPath: string | null;
    handleDownload: () => void;
    handleDelete: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ResourceValuesView: React.FC<ResourceValuesViewProps> = ({
    media,
    mediaId,
    loading,
    error,
    imageSrc,
    imageLoading,
    imageFetchError,
    isImage,
    isFileDownloading,
    deletingId,
    uploading,
    deleteError,
    uploadError,
    uploadedPath,
    handleDownload,
    handleDelete,
    fileInputRef,
    handleFileChange
}) => {
    // Validation of identifier (ID)
    if (!mediaId || isNaN(Number(mediaId))) {
        return <div className="p-8 text-center text-stone-500 font-medium">Initializing Router Path...</div>;
    }

    // Handling loading and errors
    if (loading) {
        return <div className="p-8 text-center text-stone-400 animate-pulse font-medium">Loading media details...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto my-12 p-8 bg-stone-900/10 backdrop-blur-sm shadow-2xl rounded-3xl border border-stone-800/40 text-right" dir="rtl">
            {/* Header and controls */}
            <div className="border-b border-stone-800/50 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-md">
                        Media Explorer / Media Browser
                    </span>
                    <h1 className="text-xl font-black text-stone-100 mt-2 truncate max-w-sm">
                        {media?.fileName || "Untitled file"}
                    </h1>
                    <p className="text-xs text-stone-400 mt-1" dir="ltr">
                        Media ID: <span className="font-mono font-bold text-stone-300">#{media?.id || mediaId}</span>
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleDownload}
                        disabled={isFileDownloading}
                        className="flex-1 sm:flex-none px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 disabled:bg-stone-800 disabled:text-stone-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        {isFileDownloading ? <span className="animate-spin">⏳</span> : <span>📥</span>}
                        <span>Download</span>
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={deletingId === mediaId}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-950/40 hover:bg-red-950 border border-red-800/60 text-red-300 disabled:bg-stone-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        {deletingId === mediaId ? <span className="animate-pulse">Processing...</span> : <span>🗑️</span>}
                        <span>Delete Record</span>
                    </button>
                </div>
            </div>

            {/* Notification & Data Load Messages */}
            {error && (
                <div className="mb-4 p-4 bg-red-950/20 text-red-300 border border-red-800/50 rounded-2xl text-sm text-center font-bold">
                    ⚠️ Failed to load data: {error}
                </div>
            )}
            {deleteError && <div className="mb-4 p-3 bg-red-950/20 text-red-300 border border-red-800/40 rounded-xl text-xs font-medium">⚠️ {deleteError}</div>}
            {uploadError && <div className="mb-4 p-3 bg-red-950/20 text-red-300 border border-red-800/40 rounded-xl text-xs font-medium">⚠️ {uploadError}</div>}
            {uploadedPath && <div className="mb-4 p-3 bg-emerald-950/20 text-emerald-300 border border-emerald-800/40 rounded-xl text-xs font-medium">✅ File uploaded and updated successfully!</div>}

            {/* Enhanced protected file preview section */}
            <div className="mb-6 p-4 bg-stone-950/30 border border-stone-800/40 rounded-2xl flex flex-col items-center justify-center min-h-[200px]">
                {isImage ? (
                    imageLoading ? (
                        <div className="text-center p-6 text-stone-400 animate-pulse text-xs font-medium">
                            🔄 Decoding and fetching the image securely...
                        </div>
                    ) : imageFetchError || !imageSrc ? (
                        <div className="text-center p-6">
                            <div className="text-3xl mb-2">🔒</div>
                            <p className="text-xs font-bold text-red-400">Automatic image preview failed</p>
                            <p className="text-[10px] text-stone-500 mt-1 max-w-xs">The file is protected by server permissions. Use the download button above to access it.</p>
                        </div>
                    ) : (
                        <div className="relative group overflow-hidden rounded-xl border border-stone-700 bg-stone-950/60 p-2 max-w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={imageSrc} 
                                alt={media?.fileName || "Media Preview"} 
                                className="max-h-64 object-contain rounded-lg shadow-sm transition-transform duration-250 group-hover:scale-[1.02]"
                            />
                            <div className="text-center mt-2 text-[11px] text-stone-400 font-mono truncate max-w-xs">
                                {media?.fileName}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="text-center p-6">
                        <div className="text-4xl mb-2">📄</div>
                        <p className="text-xs font-bold text-stone-200">{media?.fileName || "Document file"}</p>
                    </div>
                )}
            </div>

            {/* Metadata details and EAV */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-xs font-black text-stone-400 uppercase tracking-wide mb-1.5">📁 File type and format (Mime Type)</h3>
                    <p className="text-stone-300 font-mono text-xs bg-stone-950/40 p-3 rounded-xl border border-stone-800/50" dir="ltr">
                        {media?.mimeType || "Not specified"}
                    </p>
                </div>

                <div>
                    <h3 className="text-xs font-black text-stone-400 uppercase tracking-wide mb-1.5">📍 Server storage path (Storage Path)</h3>
                    <p className="text-stone-400 font-mono text-[11px] bg-stone-950/40 p-3 rounded-xl border border-stone-800/50 block break-all text-left" dir="ltr">
                        {media?.storagePath || "N/A"}
                    </p>
                </div>

                <div className="pt-2">
                    <h3 className="text-xs font-black text-stone-400 uppercase tracking-wide mb-2">⚙️ Dynamic properties and values (EAV Metadata)</h3>
                    
                    {media?.metadata && media.metadata.length > 0 ? (
                        <div className="space-y-2">
                            {media.metadata.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3.5 bg-blue-950/20 border border-blue-900/40 rounded-xl">
                                    <span className="text-xs font-bold text-blue-300">{item.propertyLabel}</span>
                                    <span className="text-xs text-stone-300 font-medium bg-stone-950 px-3 py-1 rounded-lg shadow-sm border border-stone-800/60">{item.valueText}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-stone-500 italic p-4 bg-stone-950/30 rounded-xl text-center border border-stone-800/40">
                            No dynamic EAV metadata properties are linked to this file.
                        </p>
                    )}
                </div>

                {/* Integrated upload area */}
                <div className="pt-6 mt-6 border-t border-stone-800/40">
                    <h3 className="text-xs font-black text-stone-400 uppercase tracking-wide mb-2">📤 Upload and replace the displayed physical file</h3>
                    <div className="p-4 border-2 border-dashed border-stone-700/60 rounded-2xl flex flex-col items-center justify-center bg-stone-950/20 hover:bg-stone-950/40 transition-all">
                        <p className="text-xs text-stone-400 text-center mb-3">
                            Replace the current physical file using built-in hooks, while preserving EAV metadata.
                        </p>
                        
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden" 
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="px-5 py-2 bg-stone-700 hover:bg-stone-600 text-stone-100 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:bg-stone-800 disabled:text-stone-500 border-0"
                        >
                            {uploading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    <span>Uploading now...</span>
                                </>
                            ) : (
                                <>
                                    <span>⬆️</span>
                                    <span>Choose replacement file</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};