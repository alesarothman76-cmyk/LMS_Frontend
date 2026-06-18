import { useQuery } from "@tanstack/react-query";
import { itemSetApi } from "../api/itemSetApi";
import { itemSetKeys } from "./itemSetKeys";

export const useItemSet = (id: number | undefined) => {
  return useQuery({
    queryKey: itemSetKeys.detail(id ?? 0),
    queryFn: () => itemSetApi.GetItemSetById(id as number),
    enabled: id !== undefined,
  });
};
