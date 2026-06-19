import { useState } from 'react';
import { mediaService } from '../services/mediaService';

export function useDownloadMedia() {
    const [downloading, setDownloading] = useState<number | null>(null); // Track the currently downloading media ID

    const downloadFile = async (mediaId: number) => {
        setDownloading(mediaId);
        try {
            const { blob, fileName } = await mediaService.downloadMediaFile(mediaId);
            
            // Create a temporary download link for the blob so the browser saves the file
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Set the saved file name
            document.body.appendChild(link);
            link.click();
            
            // Clean up temporary URL and DOM node
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download Error:", err);
            alert("Failed to download the file. It may not exist on the server.");
        } finally {
            setDownloading(null);
        }
    };

    return { downloadFile, downloading };
}