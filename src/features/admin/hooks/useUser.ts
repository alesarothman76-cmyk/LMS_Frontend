import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { userKeys } from "./userKeys";
import { usersApi } from "../api/usersApi";
import { UserSummaryDto } from "../types";

export const useUser = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<UserSummaryDto>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery({
    queryKey: userKeys.detail(id ?? ""),
    queryFn: () => usersApi.GetUserById(id as string),
    enabled: typeof id === "string" && id.length > 0,
    ...options,
  });
};
