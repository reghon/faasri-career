import fs from "fs";
import path from "path";
import pool from "../backend/app/configurations/database";

async function main() {
  const uploadsRoot = path.join(process.cwd(), "backend", "uploads");

  const oldCvDir = path.join(uploadsRoot, "cvs");
  const newCvDir = path.join(uploadsRoot, "profile-cvs");

  if (fs.existsSync(oldCvDir) && !fs.existsSync(newCvDir)) {
    fs.renameSync(oldCvDir, newCvDir);
    console.log("✓ Renamed uploads/cvs → uploads/profile-cvs");
  } else if (fs.existsSync(newCvDir)) {
    console.log("⊘ uploads/profile-cvs already exists, skipping rename");
  }

  const appCvDir = path.join(uploadsRoot, "application-cvs");
  if (!fs.existsSync(appCvDir)) {
    fs.mkdirSync(appCvDir, { recursive: true });
    console.log("✓ Created uploads/application-cvs/");
  }

  const client = await pool.connect();
  try {
    const res1 = await client.query(`
      UPDATE applicant_profiles
      SET cv_url = REPLACE(cv_url, '/uploads/cvs/', '/uploads/profile-cvs/')
      WHERE cv_url LIKE '/uploads/cvs/%'
    `);
    console.log(`✓ Updated ${res1.rowCount} applicant_profiles.cv_url rows`);

    const res2 = await client.query(`
      UPDATE apply_profile_snapshots aps
      SET cv_url = ap.cv_url
      FROM applies a
      JOIN applicant_profiles ap ON ap.id = a.applicant_profile_id
      WHERE aps.apply_id = a.id
        AND aps.cv_file_name IS NOT NULL
        AND aps.cv_url IS NULL
        AND ap.cv_url IS NOT NULL
    `);
    console.log(`✓ Backfilled ${res2.rowCount} apply_profile_snapshots.cv_url rows`);
  } finally {
    client.release();
  }

  await pool.end();
  console.log("\nMigration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
