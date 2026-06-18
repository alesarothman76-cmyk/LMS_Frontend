import { useQuery } from "@tanstack/react-query";
import { itemSetApi } from "../api/itemSetApi";
import { itemSetKeys } from "./itemSetKeys";


export const useItemSets = () => {
  return useQuery({
    queryKey: itemSetKeys.list(),
    queryFn: itemSetApi.GetAllItemSets,
  });
};
