import { resourceTemplateApi } from "../api/itemApi";
import { ResourceTemplateDto } from "../types";
import {templateKeys} from "./templateKeys";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";


 
/** A single resource template with its properties — drives the dynamic item form. */
export const useResourceTemplate = (
  id: number | undefined,
  options?: Omit<UseQueryOptions<ResourceTemplateDto>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery({
    queryKey: templateKeys.detail(id ?? -1),
    queryFn: () => resourceTemplateApi.GetTemplateById(id as number),
    enabled: typeof id === "number",
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};