import pool from "../configurations/database";
import { keysToCamel } from "./case.util";

export const queryCamel = async <T>(text: string, params: unknown[] = []): Promise<T[]> => {
  const result = await pool.query(text, params);
  return keysToCamel<T[]>(result.rows);
};

export const queryCamelOne = async <T>(text: string, params: unknown[] = []): Promise<T | null> => {
  const rows = await queryCamel<T>(text, params);
  return rows[0] ?? null;
};
