import { useQuery } from "@tanstack/react-query";
import { itemSetApi } from "../api/itemSetApi";
import { itemSetKeys } from "./itemSetKeys";


export const usePublicItemSets = () => {
  return useQuery({
    queryKey: itemSetKeys.publicList(),
    queryFn: itemSetApi.GetPublicItemSets,
  });
};
