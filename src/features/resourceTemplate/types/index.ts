export interface CreateResourceTemplateDto {
    label: string;
    description: string;
    propertyIds: number[];
    // optional detailed links to attach after creation
    propertyLinks?: PropertyToTemplateInput[];
}

export interface UpdateResourceTemplateDto {
    label: string;
    description: string;
}

export interface GetTemplate {
    id: number;
    label: string;
    description: string;
}

export interface TemplatePropertyItem {
    propertyId: number;
    propertyName: string;
    isRequired: boolean;
    displayOrder: number;
    alternateLabel: string | null;
}

export interface GetTemplateWithProperties extends GetTemplate {
    properties: TemplatePropertyItem[];
}

export interface DeleteTemplateResponse {
    id: number;
}

// object returned by the API for each property linked to a template
export interface SystemProperty {
    id: number;
    label: string;
    type: string;
}

// object that the Handler expects within the array (PropertyToTemplateInput)
export interface PropertyToTemplateInput {
    propertyId: number;
    isRequired: boolean;
    displayOrder: number;
    alternateLabel: string | null;
    
}

// object used in the frontend to represent a property linked to a template, includes additional info for display purposes
export interface AddPropertiesToTemplateRequest {
    properties: PropertyToTemplateInput[];
}

export interface CreatePropertyDto {
    name: string;
    type: string;
}

export interface NewPropertyAndLinkInput {
    // data for creating a new property
    vocabularyId: number;
    localName: string;
    label: string;
    termUri: string;
    
    //  data for linking the newly created property to the template
    isRequired: boolean;
    displayOrder: number;
    alternateLabel: string | null;
}

export interface AddNewPropertiesToTemplateRequest {
    properties: NewPropertyAndLinkInput[];
}
export interface ApiResponse {
    success: boolean;
    message: string;
}