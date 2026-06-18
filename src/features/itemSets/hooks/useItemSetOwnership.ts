import { useQuery } from "@tanstack/react-query";
import { itemSetApi } from "../api/itemSetApi";
import { itemSetKeys } from "./itemSetKeys";

export const useItemSetOwnership = (id: number | undefined) => {
  return useQuery({
    queryKey: itemSetKeys.ownership(id ?? 0),
    queryFn: () => itemSetApi.CheckOwnership(id as number),
    enabled: id !== undefined,
  });
};
