import { useState } from 'react';
import { mediaService } from '../services/mediaService';
import { MediaDto } from '../types';
import { jwtDecode } from 'jwt-decode';

export function useMediaByOwner() {
    const [mediaList, setMediaList] = useState<MediaDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMyMedia = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Load the current token from localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            
            if (!token) {
                throw new Error("Login credentials were not found. Please sign in first.");
            }

            // 2. Decode the token to extract the User ID (NameIdentifier claim)
            const decoded: { nameid?: string; "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string } = jwtDecode(token);
            
            // Note: the JWT ID key is usually 'nameid' or the full claim URI
            const currentUserId = decoded.nameid || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

            if (!currentUserId) {
                throw new Error("Failed to determine the user identity from the token.");
            }

            console.log("👤 Current requester ID:", currentUserId);

            // 3. Call the API using the derived owner ID
            const data = await mediaService.getByOwner(currentUserId);
            setMediaList(data);
        } catch (err: unknown) {
            console.error("My Media Fetch Error: ", err);
            setError((err as { message?: string }).message || (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch your media files.');
            setMediaList([]);
        } finally {
            setLoading(false);
        }
    };

    return { mediaList, loading, error, fetchMyMedia };
}