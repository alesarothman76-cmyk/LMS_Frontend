import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemSetApi } from "../api/itemSetApi";
import { itemSetKeys } from "./itemSetKeys";
import { CreateItemSetDto} from "../types/itemSetTypes";

/**
 * Creates a new item set.
 * Mirrors: POST /itemsets
 */
export const useCreateItemSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateItemSetDto) => itemSetApi.CreateItemSet(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemSetKeys.lists() });
      toast.success("Item set created");
    },
    onError: () => {
      toast.error("Failed to create item set");
    },
  });
};