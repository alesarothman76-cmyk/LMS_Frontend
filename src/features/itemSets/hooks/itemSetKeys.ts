export const itemSetKeys = {
  all: ["itemSets"] as const,
  lists: () => [...itemSetKeys.all, "list"] as const,
  list: () => [...itemSetKeys.lists()] as const,
  publicList: () => [...itemSetKeys.all, "public"] as const,
  details: () => [...itemSetKeys.all, "detail"] as const,
  detail: (id: number) => [...itemSetKeys.details(), id] as const,
  ownership: (id: number) => [...itemSetKeys.all, "ownership", id] as const,
};
