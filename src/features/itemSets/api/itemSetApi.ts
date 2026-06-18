import { apiClient } from "@/shared/api/apiclient";
import { ApiEndpoints } from "@/shared/api/ApiEndpoints";
import {
  ItemSetDto,
  CreateItemSetDto,
  UpdateItemSetDto,
  ItemSetMembersDto,
} from "../types/itemSetTypes";

export const itemSetApi = {

  CreateItemSet: async (dto: CreateItemSetDto): Promise<number> => {
    // Backend returns the created id via CreatedAtAction (mirrors itemApi's primitive number return)
    const response = await apiClient.post<number>(
      ApiEndpoints.itemSets.CREATE,
      dto
    );
    return response.data;
  },

  UpdateItemSet: async (id: number, dto: UpdateItemSetDto): Promise<boolean> => {
    const response = await apiClient.put(
      ApiEndpoints.itemSets.UPDATE(id),
      dto
    );
    return response.status === 204;
  },

  DeleteItemSet: async (id: number): Promise<boolean> => {
    const response = await apiClient.delete(
      ApiEndpoints.itemSets.DELETE(id)
    );
    return response.status === 204;
  },

  AddItemToSet: async (setId: number, itemId: number): Promise<boolean> => {
    const response = await apiClient.post(
      ApiEndpoints.itemSets.ADD_ITEM(setId, itemId)
    );
    return response.status === 200;
  },

  RemoveItemFromSet: async (setId: number, itemId: number): Promise<boolean> => {
    const response = await apiClient.delete(
      ApiEndpoints.itemSets.REMOVE_ITEM(setId, itemId)
    );
    return response.status === 204;
  },

  GetAllItemSets: async (): Promise<ItemSetDto[]> => {
    const response = await apiClient.get<ItemSetDto[]>(
      ApiEndpoints.itemSets.GET_ALL
    );
    return response.data;
  },

  GetPublicItemSets: async (): Promise<ItemSetDto[]> => {
    const response = await apiClient.get<ItemSetDto[]>(
      ApiEndpoints.itemSets.GET_PUBLIC
    );
    return response.data;
  },

  GetItemSetById: async (id: number): Promise<ItemSetMembersDto> => {
    const response = await apiClient.get<ItemSetMembersDto>(
      ApiEndpoints.itemSets.GET_BY_ID(id)
    );
    return response.data;
  },

  CheckOwnership: async (id: number): Promise<boolean> => {
    const response = await apiClient.get<boolean>(
      ApiEndpoints.itemSets.CHECK_OWNERSHIP(id)
    );
    return response.data;
  },
};
