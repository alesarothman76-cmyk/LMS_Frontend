export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: () => [...userKeys.lists()] as const,
  byRole: (role: string) => [...userKeys.all, "by-role", role] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
