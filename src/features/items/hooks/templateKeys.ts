
export const templateKeys = {
  all: ["resourceTemplates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: number) => [...templateKeys.details(), id] as const,
};