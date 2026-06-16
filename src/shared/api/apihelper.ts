export type QueryFilterPrimitive = string | number | boolean | Date;

export type QueryFilterRange = {
  from?: QueryFilterPrimitive | null;
  to?: QueryFilterPrimitive | null;
};

export type QueryFilterValue =
  | QueryFilterPrimitive
  | QueryFilterPrimitive[]
  | QueryFilterRange
  | null
  | undefined;

export type QueryFilterObject = Record<string, QueryFilterValue>;

const hasFilterValue = (value: unknown): value is QueryFilterPrimitive =>
  value !== null && value !== undefined && value !== "";

const isRangeFilter = (value: QueryFilterValue): value is QueryFilterRange =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Date) &&
  ("from" in value || "to" in value);

const serializeFilterValue = (value: QueryFilterPrimitive) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
};

export const createQueryParams = (
  filters: QueryFilterObject = {}
): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (!hasFilterValue(value)) return;

    if (Array.isArray(value)) {
      value
        .filter(hasFilterValue)
        .forEach((item) => params.append(key, serializeFilterValue(item)));
      return;
    }

    if (isRangeFilter(value)) {
      if (hasFilterValue(value.from)) {
        params.set(`${key}From`, serializeFilterValue(value.from));
      }

      if (hasFilterValue(value.to)) {
        params.set(`${key}To`, serializeFilterValue(value.to));
      }

      return;
    }

    params.set(key, serializeFilterValue(value));
  });

  return params;
};

export const createQueryString = (filters: QueryFilterObject = {}) => {
  const queryString = createQueryParams(filters).toString();

  return queryString ? `?${queryString}` : "";
};

export const createQueryConfig = (filters: QueryFilterObject = {}) => ({
  params: createQueryParams(filters),
});
/*
export function buildQueryParams(filters: Record<string, any>): string {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  return params.toString() ? `?${params.toString()}` : '';
}*/