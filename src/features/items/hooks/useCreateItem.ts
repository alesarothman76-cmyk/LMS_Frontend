import { itemKeys } from "./itemKeys";
import { itemApi } from "../api/itemApi";
import { CreateItemDto } from "../types";

//import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateItemDto) => itemApi.CreateItem(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
    },
  });
};