import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemSetApi } from "../api/itemSetApi";
import { itemSetKeys } from "./itemSetKeys";


export const useDeleteItemSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => itemSetApi.DeleteItemSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemSetKeys.lists() });
      toast.success("Item set deleted");
    },
    onError: () => {
      toast.error("Failed to delete item set");
    },
  });
};
