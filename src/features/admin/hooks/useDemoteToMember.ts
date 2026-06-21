import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./userKeys";
import { usersApi } from "../api/usersApi";
import { UserActionResult } from "../types";

export const useDemoteToMember = () => {
  const queryClient = useQueryClient();

  return useMutation<UserActionResult, unknown, string>({
    mutationFn: (id: string) => usersApi.DemoteToMember(id),
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};
