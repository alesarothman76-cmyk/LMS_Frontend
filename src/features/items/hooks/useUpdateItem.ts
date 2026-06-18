import { itemKeys } from "./itemKeys";
import { itemApi } from "../api/itemApi";

import { UpdateItemDto } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateItemDto }) =>
      itemApi.UpdateItem(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
    },
  });
};