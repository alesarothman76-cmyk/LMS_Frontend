import { itemKeys } from "./itemKeys";
import { itemApi } from "../api/itemApi";
import { ItemDto } from "../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useItem = (
  id: number | undefined,
  options?: Omit<UseQueryOptions<ItemDto>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery({
    queryKey: itemKeys.detail(id ?? -1),
    queryFn: () => itemApi.GetItemById(id as number),
    enabled: typeof id === "number",
    ...options,
  });
};