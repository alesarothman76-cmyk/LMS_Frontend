export interface MediaValueItem {
    id: number;
    propertyId: number;
    valueText: string;
    valueUri: string | null;
    valueResourceId: number | null;
    type: string;
    language: string;
}

export interface CreateMediaRequest {
    itemId: number;
    fileName: string;
    altText: string;
    ownerId: string;
    values: MediaValueItem[];
}

export interface MetadataItem {
    propertyLabel: string;
    valueText: string;
}

export interface GetMediaResponse {
    id: number;
    fileName: string;
    storagePath: string;
    fileSize: number;
    mimeType: string;
    metadata: MetadataItem[];
}

export interface MediaValue {
    id: number;
    propertyId: number;
    valueText: string;
    valueUri: string;
    valueResourceId: number | null;
    type: string;
    language: string;
}

export interface MimeTypeMediaResponse {
    id: number;
    itemId: number | null;
    fileName: string;
    altText: string;
    values: MediaValue[]; // 👈 exact match for the JSON returned from the server
}

// represents ResourceValueDto in the backend
export interface ResourceValueDto {
    id: number;
    propertyId: number;
    valueText: string;
    valueUri: string | null;
    valueResourceId: number | null;
    type: string;
    language: string;
}

// represents MediaDto in the backend exactly
export interface MediaDto {
    id: number;
    itemId: number | null;
    fileName: string;
    altText: string | null;
    values: ResourceValueDto[];
}

export interface UpdateMediaDto {
    id: number;
    itemId: number | null;
    fileName: string;
    altText: string | null;
    values: ResourceValueDto[]; 
    currentUserId: string;      
}