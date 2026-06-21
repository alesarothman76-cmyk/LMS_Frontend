import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { userKeys } from "./userKeys";
import { usersApi } from "../api/usersApi";
import { UserSummaryDto } from "../types";

export const useUsersByRole = (
  role: string | undefined,
  options?: Omit<UseQueryOptions<UserSummaryDto[]>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery({
    queryKey: userKeys.byRole(role ?? ""),
    queryFn: () => usersApi.GetUsersByRole(role as string),
    enabled: typeof role === "string" && role.length > 0,
    ...options,
  });
};
