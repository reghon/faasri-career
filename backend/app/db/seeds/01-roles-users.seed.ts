import pool from "../../configurations/database";
import bcrypt from "bcryptjs";

// ============================================================
// SEED DATA
// ============================================================

const ROLE_SEED = [
  { code: "SUPERADMIN", name: "superadmin", description: "Super Administrator", is_superadmin: true,  is_active: true },
  { code: "HR",         name: "hr",         description: "Human Resource",       is_superadmin: false, is_active: true },
  { code: "APPLICANT",  name: "applicant",  description: "Job Applicant",        is_superadmin: false, is_active: true },
];

const USER_SEED = [
  {
    id:           "696e3ebe-368f-46ab-9598-6e896d84ef8a",
    role_name:    "superadmin",
    email:        "admin@faasri.com",
    raw_password: "password123",
    is_active:    true,
  },
  {
    id:           "d9a8a5d2-21d2-4d83-a831-49af945b49ba",
    role_name:    "hr",
    email:        "hr@faasri.com",
    raw_password: "password123",
    is_active:    true,
  },
  {
    id:           "eb6e7d32-886a-4232-9a7b-d1f24d2b45c4",
    role_name:    "applicant",
    email:        "test@faasri.com",
    raw_password: "password123",
    is_active:    true,
  },
  {
    id:           "484cc8bc-8f5e-4b15-a64d-ca9f333cf55f",
    role_name:    "applicant",
    email:        "user2@example.com",
    raw_password: "securePass456",
    is_active:    true,
  },
];

const MANAGEMENT_PROFILE_SEED = [
  {
    id:        "fbb1fd25-e29c-474b-a622-0e51c3e336bd",
    user_id:   "d9a8a5d2-21d2-4d83-a831-49af945b49ba",
    role_name: "hr",
    full_name: "Budi HR",
    is_active: true,
  },
];

export { USER_SEED };

// ============================================================
// SEED FUNCTIONS
// ============================================================

export async function seedRolesAndUsers() {
  await seedRoles();
  await seedUsers();
  await seedManagementProfiles();
}

async function seedRoles() {
  for (const role of ROLE_SEED) {
    await pool.query(
      `INSERT INTO roles (code, name, description, is_superadmin, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (code) DO NOTHING`,
      [role.code, role.name, role.description, role.is_superadmin, role.is_active],
    );
  }
  console.log("✅ Roles seeded");
}

async function seedUsers() {
  for (const user of USER_SEED) {
    const password = await bcrypt.hash(user.raw_password, 10);
    const roleResult = await pool.query(
      `SELECT id FROM roles WHERE name = $1 LIMIT 1`,
      [user.role_name],
    );

    await pool.query(
      `INSERT INTO users (id, role_id, email, password, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      [user.id, roleResult.rows[0].id, user.email, password, user.is_active],
    );
  }
  console.log("✅ Users seeded");
}

async function seedManagementProfiles() {
  for (const profile of MANAGEMENT_PROFILE_SEED) {
    const roleResult = await pool.query(
      `SELECT id FROM roles WHERE name = $1 LIMIT 1`,
      [profile.role_name],
    );

    await pool.query(
      `INSERT INTO management_profiles (id, user_id, role_id, full_name, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT DO NOTHING`,
      [profile.id, profile.user_id, roleResult.rows[0].id, profile.full_name, profile.is_active],
    );
  }
  console.log("✅ Management profiles seeded");
}