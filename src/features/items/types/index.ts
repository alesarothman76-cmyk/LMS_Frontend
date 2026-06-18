
// ---------------------------------------------------------------------------
// Resource Value DTOs (Mirrors LMS.App.DTOs.Value)
// ---------------------------------------------------------------------------

/**
 * Core resource value model representing an EAV (Entity-Attribute-Value) property assignment.
 * Mirrors: ResourceValueDto.cs
 */
export interface ResourceValueDto {
  id: number;
  propertyId: number;
  valueText: string | null;
  valueUri: string | null;
  valueResourceId: number | null;
  type: string; // e.g., "Literal", "Uri", "ResourceLink"
  language: string | null; // e.g., "en", "ar"
}

/**
 * Payload required to bind a value assignment to a newly instantiated data item.
 * Mirrors: CreateResourceValueDto.cs
 */
export interface CreateResourceValueDto {
  propertyId: number;
  valueText: string | null;
  valueUri: string | null;
  valueResourceId: number | null;
  type: string;
  language: string | null;
}

/**
 * Payload dispatched to alter an isolated property assignment value.
 * Mirrors: UpdateResourceValueDto.cs
 */
export interface UpdateResourceValueDto {
  valueText: string | null;
  valueResourceId: number | null;
  type: string;
  language: string | null;
}

// ---------------------------------------------------------------------------
// Item DTOs (Mirrors LMS.App.DTOs.Item)
// ---------------------------------------------------------------------------

/**
 * Standard data entry item instance containing its template schema association and bound property statements.
 * Mirrors: ItemDto.cs
 */
export interface ItemDto {
  id: number;
  templateId: number;
  values: ResourceValueDto[];
}

/**
 * Command structural format dispatched to append a brand new metadata entry item node.
 * Mirrors: CreateItemDto.cs
 */
export interface CreateItemDto {
  templateId: number;
  values: CreateResourceValueDto[];
}

/**
 * Structural contract transmitted to update values bound inside an existing item.
 * Mirrors: UpdateItemDto.cs
 */
export interface UpdateItemDto {
  id: number;
  templateId: number;
  values: ResourceValueDto[];
}

// ---------------------------------------------------------------------------
// UI & State Management Helper Extras
// ---------------------------------------------------------------------------

export interface ItemQueryFilters {
  templateId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ItemListResponse {
  items: ItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * Mirrors the real backend DTOs:
 *   LMS.App.DTOs.ResourceTemplate.ResourceTemplateDto
 *   LMS.App.DTOs.ResourceProperty.ResourcePropertyDto
 *
 * Note: there is no per-property "data type" (literal/uri/resource) here —
 * a property is identified by localName/label/termUri, plus template-scoped
 * isRequired/displayOrder/alternateLabel. The item form treats every value
 * as free text unless told otherwise.
 *
 * Two different template shapes come back from the API depending on the call:
 *   - GET /ResourceTemplate        -> GetTemplate[]        (id, label, description — no properties)
 *   - GET /ResourceTemplate/{id}   -> ResourceTemplateDto   (adds properties[])
 * Don't conflate them — the list endpoint can't be used to render the item
 * form, only to populate a "pick a template" selector.
 */

export interface GetTemplate {
  id: number;
  label: string;
  description: string | null;
}

export interface ResourcePropertyDto {
  propertyId: number;
  localName: string;
  label: string;
  termUri: string;
  isRequired: boolean;
  displayOrder: number;
  alternateLabel: string | null;
}

export interface ResourceTemplateDto {
  id: number;
  label: string;
  description: string | null;
  properties: ResourcePropertyDto[];
}