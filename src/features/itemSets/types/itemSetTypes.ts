import { ItemDto, ResourceValueDto } from "../../items/types";

// ---------------------------------------------------------------------------
// ItemSet DTOs (Mirrors LMS.App.DTOs.ItemSet)
// ---------------------------------------------------------------------------

/**
 * Standard item set instance with its descriptive metadata and bound property statements.
 * Mirrors: ItemSetDto.cs
 */
export interface ItemSetDto {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
  values: ResourceValueDto[] | null;
}

/**
 * Command structural format dispatched to create a brand new item set.
 * Mirrors: CreateItemSetDto.cs
 */
export interface CreateItemSetDto {
  title: string;
  description: string | null;
  isPublic: boolean;
  values: ResourceValueDto[] | null;
}

/**
 * Structural contract transmitted to update an existing item set.
 * Mirrors: UpdateItemSetDto.cs
 */
export interface UpdateItemSetDto {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
  values: ResourceValueDto[] | null;
}

/**
 * Item set bundled together with its member items.
 * Mirrors: ItemSetMembersDto.cs
 */
export interface ItemSetMembersDto {
  setInfo: ItemSetDto;
  members: ItemDto[];
}

// ---------------------------------------------------------------------------
// UI & State Management Helper Extras
// ---------------------------------------------------------------------------

export interface ItemSetQueryFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}
