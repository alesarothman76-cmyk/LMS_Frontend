import { resourceTemplateApi } from "../api/itemApi";
import { GetTemplate } from "../types";
import {templateKeys} from "./templateKeys";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useResourceTemplates = (
  options?: Omit<UseQueryOptions<GetTemplate[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: () => resourceTemplateApi.GetAllTemplates(),
    staleTime: 5 * 60 * 1000, // templates change rarely — cache longer
    ...options,
  });
};
 