import "dotenv/config";
import pool from "../configurations/database";
import { seedRolesAndUsers } from "./seeds/01-roles-users.seed";
import { seedApplicantProfiles } from "./seeds/02-applicant-profiles.seed";
import { seedMasterData } from "./seeds/03-master-data.seed";
import { seedJobs } from "./seeds/04-jobs.seed";
import { seedApplyStatuses, seedPermissions } from "./seeds/05-permissions-apply-statuses.seed";

async function seed() {
  try {
    console.log("🌱 Starting seed...\n");

    await seedRolesAndUsers();
    // await seedApplicantProfiles();
    await seedMasterData();
    // await seedJobs();
    await seedApplyStatuses();
    await seedPermissions();

    console.log("\n🎉 DONE SEEDING");
  } catch (err) {
    console.error("❌ ERROR SEED:", err);
  } finally {
    await pool.end();
  }
}

seed();
