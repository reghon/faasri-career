import "dotenv/config";
import { Umzug, MigrationParams } from "umzug";
import path from "path";
import fs from "fs";
import pool from "../configurations/database";

const pgStorage = {
  async executed() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        name VARCHAR(255) PRIMARY KEY,
        run_at TIMESTAMP DEFAULT NOW()
      )
    `);
    const result = await pool.query("SELECT name FROM migrations ORDER BY run_at ASC");
    return result.rows.map((r: { name: string }) => r.name);
  },

  async logMigration({ name }: { name: string }) {
    await pool.query("INSERT INTO migrations (name) VALUES ($1) ON CONFLICT DO NOTHING", [name]);
  },

  async unlogMigration({ name }: { name: string }) {
    await pool.query("DELETE FROM migrations WHERE name = $1", [name]);
  },
};

const migrationsDir = path.join(__dirname, "migrations");

const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort()
  .map((filename) => ({
    name: filename,
    path: path.join(migrationsDir, filename),
  }));

console.log(
  "📂 Migrations found:",
  migrationFiles.map((f) => f.name),
);

export const migrator = new Umzug({
  migrations: migrationFiles.map(({ name, path: filePath }) => ({
    name,
    up: async () => {
      console.log(`⚡ Running: ${name}`);
      const sql = fs.readFileSync(filePath, "utf-8");
      await pool.query(sql);
    },
    down: async () => {
      console.warn(`⏪ Rollback not implemented for: ${name}`);
    },
  })),
  storage: pgStorage,
  logger: console,
});
