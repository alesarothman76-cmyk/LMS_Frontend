import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemSetApi } from "../api/itemSetApi";
import { itemSetKeys } from "./itemSetKeys";
import { UpdateItemSetDto } from "../types/itemSetTypes";

export const useUpdateItemSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateItemSetDto }) =>
      itemSetApi.UpdateItemSet(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: itemSetKeys.lists() });
      queryClient.invalidateQueries({ queryKey: itemSetKeys.detail(id) });
      toast.success("Item set updated");
    },
    onError: () => {
      toast.error("Failed to update item set");
    },
  });
};