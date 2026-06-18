import { apiClient } from "@/shared/api/apiclient";
import { ApiEndpoints } from "@/shared/api/ApiEndpoints";
import { ItemDto, 
    CreateItemDto, 
    UpdateItemDto,
    ResourceTemplateDto,
    GetTemplate
    } from "../types";

export const itemApi = {

CreateItem: async (CreateItem: CreateItemDto): Promise<number> => {
    // Specifying <number> here handles the primitive integer return type correctly
    const response = await apiClient.post<number>(
      ApiEndpoints.items.CREATE,
      CreateItem
    );
    return response.data;
  },

UpdateItem: async (id: number, dto: UpdateItemDto): Promise<boolean> => {
    const response = await apiClient.put(
      ApiEndpoints.items.UPDATE(id),
      dto
    );
    return response.status === 200;
  }
  ,
DeleteItem: async (id: number): Promise<boolean> => {
    const response = await apiClient.delete(
      ApiEndpoints.items.DELETE(id)
    );
    return response.status === 200;
  },

GetItemById: async (id: number): Promise<ItemDto> => {
    const response = await apiClient.get<ItemDto>(
      ApiEndpoints.items.GET_BY_ID(id)
    );
    return response.data;
  },
  GetAllItems: async (TemplateId?: number): Promise<ItemDto[]> => {
    const response = await apiClient.get<ItemDto[]>(
      ApiEndpoints.items.GET_ALL(TemplateId)
    );
    return response.data;
  }
}

export const resourceTemplateApi = {
  GetTemplateById: async (id: number): Promise<ResourceTemplateDto> => {
    const response = await apiClient.get<ResourceTemplateDto>(
      ApiEndpoints.resourceTemplates.GET_BY_ID(id)
    );
    return response.data;
  },
 
  // GET /ResourceTemplate (no id) -> list shape only: id/label/description.
  // Use this to populate the "choose a template" selector; fetch GetTemplateById
  // when you need the full property list to render the item form.
  GetAllTemplates: async (): Promise<GetTemplate[]> => {
    const response = await apiClient.get<GetTemplate[]>(
      ApiEndpoints.resourceTemplates.BASE
    );
    return response.data;
  },
};