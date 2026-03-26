import "dotenv/config";
import { migrator } from "./migrator";
import pool from "../configurations/database";

async function main() {
  const command = process.argv[2];

  try {
    if (command === "down") {
      await migrator.down();
      console.log("✅ Last migration rolled back");
    } else {
      await migrator.up();
      console.log("✅ All migrations applied");
    }
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
