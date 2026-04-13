import { PoolClient } from "pg";
import pool from "../configurations/database";
import { keysToCamel } from "./case.util";

type DbClient = PoolClient;

const isDbClient = (value: unknown): value is DbClient => {
  return !!value && typeof value === "object" && "query" in value;
};

export const queryCamel = async <T>(dbOrText: DbClient | string, textOrParams: string | unknown[] = [], maybeParams: unknown[] = []): Promise<T[]> => {
  const db = isDbClient(dbOrText) ? dbOrText : pool;
  const text = typeof dbOrText === "string" ? dbOrText : (textOrParams as string);
  const params = typeof dbOrText === "string" ? (textOrParams as unknown[]) : maybeParams;

  const result = await db.query(text, params);
  return keysToCamel<T[]>(result.rows);
};

export const queryCamelOne = async <T>(dbOrText: DbClient | string, textOrParams: string | unknown[] = [], maybeParams: unknown[] = []): Promise<T | null> => {
  const rows = typeof dbOrText === "string" ? await queryCamel<T>(dbOrText, textOrParams as unknown[]) : await queryCamel<T>(dbOrText, textOrParams as string, maybeParams);

  return rows[0] ?? null;
};
