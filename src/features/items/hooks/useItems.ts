import { itemKeys } from "./itemKeys";
import { itemApi } from "../api/itemApi";
import { ItemDto } from "../types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useItems = (
  templateId?: number,
  options?: Omit<UseQueryOptions<ItemDto[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: itemKeys.list(templateId),
    queryFn: () => itemApi.GetAllItems(templateId),
    ...options,
  });
};