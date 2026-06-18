import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemSetApi } from "../api/itemSetApi";
import { itemSetKeys } from "./itemSetKeys";

export const useAddItemToSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setId, itemId }: { setId: number; itemId: number }) =>
      itemSetApi.AddItemToSet(setId, itemId),
    onSuccess: (_data, { setId }) => {
      queryClient.invalidateQueries({ queryKey: itemSetKeys.detail(setId) });
      toast.success("Item added to set");
    },
    onError: () => {
      toast.error("Failed to add item to set");
    },
  });
};
