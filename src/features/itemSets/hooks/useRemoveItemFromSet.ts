import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemSetApi } from "../api/itemSetApi";
import { itemSetKeys } from "./itemSetKeys";


export const useRemoveItemFromSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setId, itemId }: { setId: number; itemId: number }) =>
      itemSetApi.RemoveItemFromSet(setId, itemId),
    onSuccess: (_data, { setId }) => {
      queryClient.invalidateQueries({ queryKey: itemSetKeys.detail(setId) });
      toast.success("Item removed from set");
    },
    onError: () => {
      toast.error("Failed to remove item from set");
    },
  });
};
