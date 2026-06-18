
import { itemKeys } from "./itemKeys";
import { itemApi } from "../api/itemApi";

import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => itemApi.DeleteItem(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: itemKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
    },
  });
};