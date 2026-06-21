import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./userKeys";
import { usersApi } from "../api/usersApi";
import { UserActionResult } from "../types";

export const useReactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserActionResult, unknown, string>({
    mutationFn: (id: string) => usersApi.Reactivate(id),
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};
