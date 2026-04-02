export const toCamelCase = (value: string): string => {
  return value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
};

export const keysToCamel = <T>(value: unknown): T => {
  if (Array.isArray(value)) {
    return value.map((item) => keysToCamel(item)) as T;
  }

  if (value !== null && typeof value === "object" && value.constructor === Object) {
    const result: Record<string, unknown> = {};

    Object.keys(value as Record<string, unknown>).forEach((key) => {
      const camelKey = toCamelCase(key);
      result[camelKey] = keysToCamel((value as Record<string, unknown>)[key]);
    });

    return result as T;
  }

  return value as T;
};
