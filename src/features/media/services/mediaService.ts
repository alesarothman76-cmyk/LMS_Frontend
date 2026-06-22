import { createQueryConfig, QueryFilterObject } from '@/shared/api/apihelper';
import { apiClient } from '../../../shared/api/apiclient';
import { ApiEndpoints } from '../../../shared/api/ApiEndpoints';
import { CreateMediaRequest, GetMediaResponse, MediaDto, UpdateMediaDto } from "../types";

export const mediaService = {
  // 1. create media entry (metadata) without file upload
  createMedia: async (data: CreateMediaRequest) => {
    const response = await apiClient.post(ApiEndpoints.media.CREATE, data);
    return response.data;
  },

  // 2. get media metadata
  getMedia: async (mediaId: number): Promise<GetMediaResponse> => {
    const response = await apiClient.get<GetMediaResponse>(ApiEndpoints.media.GET_METADATA(mediaId));
    return response.data;
  },

  // Fetch media data to populate the form
  getMediaForEdit: async (mediaId: number): Promise<MediaDto> => {
      const response = await apiClient.get<MediaDto>(`/media/metadata/${mediaId}`); 
      return response.data;
  },

  // 3. get media by MIME type
  getByMimeType: async (mimeType: string): Promise<MediaDto[]> => {
    const response = await apiClient.get<MediaDto[]>(ApiEndpoints.media.GET_BY_MIME_TYPE(mimeType));
    return response.data;
  },

  // 4. get media by owner
  getByOwner: async (ownerId: string, filters: QueryFilterObject = {}): Promise<MediaDto[]> => {
    const config = createQueryConfig(filters);
    const response = await apiClient.get<MediaDto[]>(
      ApiEndpoints.media.GET_BY_OWNER(ownerId),
      config
    );
    return response.data;
  },

  // 5. get media by item
  getByItemId: async (itemId: number): Promise<MediaDto[]> => {
    const response = await apiClient.get<MediaDto[]>(ApiEndpoints.media.GET_BY_ITEM(itemId));
    return response.data;
  },

  // 6. update media metadata (Edit)
  updateMedia: async (id: number, dto: UpdateMediaDto): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(ApiEndpoints.media.EDIT(id), dto);
    return response.data;
  },

  // 7. upload media file (using FormData)
  uploadMediaFile: async (mediaId: number, file: File): Promise<{ path: string }> => {
    const formData = new FormData();
    formData.append('mediaId', mediaId.toString());
    formData.append('file', file);

    const response = await apiClient.post<{ path: string }>(ApiEndpoints.media.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // 8. download media file
  downloadMediaFile: async (mediaId: number): Promise<{ blob: Blob; fileName: string }> => {
    const response = await apiClient.get(ApiEndpoints.media.DOWNLOAD(mediaId), {
      responseType: 'blob'
    });

    const contentDisposition = response.headers['content-disposition'];
    let fileName = `media_file_${mediaId}`;
    if (contentDisposition?.includes('filename=')) {
        fileName = contentDisposition.split('filename=')[1].replace(/["']/g, '');
    }

    return { blob: response.data, fileName };
  },

  // 9. delete media
  deleteMedia: async (mediaId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(ApiEndpoints.media.DELETE(mediaId));
    return response.data;
  },

  // 10. get all media
  getAllMedia: async (filters: QueryFilterObject = {}): Promise<MediaDto[]> => {
    const config = createQueryConfig(filters);
    
    const response = await apiClient.get<MediaDto[]>(
      ApiEndpoints.media.BASE, 
      config
    );
    return response.data;
  },
};