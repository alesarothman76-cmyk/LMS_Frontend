import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { userKeys } from "./userKeys";
import { usersApi } from "../api/usersApi";
import { UserSummaryDto } from "../types";

export const useUsers = (
  options?: Omit<UseQueryOptions<UserSummaryDto[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => usersApi.GetAllUsers(),
    ...options,
  });
};
