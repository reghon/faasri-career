import "dotenv/config";
import pool from "../configurations/database";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("🌱 Seeding roles...");
    await pool.query(`
      INSERT INTO roles (id, name, description, "isActive", "createdAt", "updatedAt")
      VALUES
        (gen_random_uuid(), 'superadmin', 'Super Administrator with full access', true, NOW(), NOW()),
        (gen_random_uuid(), 'hr',         'Human Resource staff',                 true, NOW(), NOW()),
        (gen_random_uuid(), 'applicant',  'Job applicant',                        true, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
    `);
    console.log("✅ Roles seeded");

  //  USER
    console.log("🌱 Seeding user...");
    const userId = "dbc29aef-a117-4a26-950b-79d0c2c3999c";
    const hashedPassword = await bcrypt.hash("password123", 10);

    const roleResult = await pool.query(`SELECT id FROM roles WHERE name = 'applicant' LIMIT 1`);
    const roleId = roleResult.rows[0]?.id;
    if (!roleId) throw new Error("Role applicant tidak ditemukan");

    await pool.query(
      `
      INSERT INTO users (id, email, password, "isActive", "createdAt", "updatedAt", role_id)
      VALUES ($1, 'test@faasri.com', $2, true, NOW(), NOW(), $3)
      ON CONFLICT (id) DO NOTHING
    `,
      [userId, hashedPassword, roleId],
    );
    console.log("✅ User seeded");

    // APPLICANT PROFILE
    console.log("🌱 Seeding applicant profile...");
    const profileId = "a1b2c3d4-0000-0000-0000-000000000001";

    await pool.query(
      `
      INSERT INTO applicant_profiles (s
        id, "fullName", "birthPlace", "birthDate", gender,
        "phoneCode", phone, address, kelurahan, kecamatan,
        city, province, "postalCode", "isSameAddress",
        "linkedinUrl", "avatarUrl", "cvUrl", "cvFileName",
        "jobSource", "updatedBy", "createdAt", "updatedAt", user_id
      ) VALUES (
        $1, 'Raihan Ghani', 'Jakarta', '1999-05-10', 'male',
        '+62', '81234567890', 'Jl. Sudirman No.1', 'Senayan', 'Kebayoran Baru',
        'Jakarta Selatan', 'DKI Jakarta', '12190', false,
        'https://linkedin.com/in/raihanghani', null, null, null,
        'LinkedIn', 'system', NOW(), NOW(), $2
      )
      ON CONFLICT (id) DO NOTHING
    `,
      [profileId, userId],
    );
    console.log("✅ Applicant profile seeded");

    // EDUCATION
    console.log("🌱 Seeding education...");
    await pool.query(
      `
      INSERT INTO educations (
        id, level, country, institution, major,
        "isStillStudying", "startDay", "startMonth", "startYear",
        "endDay", "endMonth", "endYear", gpa, "gpaScale",
        "updatedBy", "createdAt", "updatedAt", applicant_profile_id
      ) VALUES (
        gen_random_uuid(), 'S1', 'Indonesia', 'Universitas Indonesia', 'Teknik Informatika',
        false, '1', '8', '2018',
        '30', '7', '2022', '3.75', '4.00',
        'system', NOW(), NOW(), $1
      )
    `,
      [profileId],
    );
    console.log("✅ Education seeded");

    // WORK EXPERIENCE
    console.log("🌱 Seeding work experience...");
    await pool.query(
      `
      INSERT INTO work_experiences (
        id, company, industry, position, "employmentType",
        "jobLevel", "teamSize", "startDay", "startMonth", "startYear",
        "endDay", "endMonth", "endYear", "isCurrentJob",
        responsibilities, "leaveReason",
        "referenceName", "referencePosition", "referencePhoneCode",
        "referencePhone", "referenceEmail",
        "updatedBy", "createdAt", "updatedAt", applicant_profile_id
      ) VALUES (
        gen_random_uuid(), 'PT Teknologi Maju', 'Information Technology', 'Frontend Developer', 'Full-time',
        'Staff', '5-10', '1', '3', '2022',
        null, null, null, true,
        'Mengembangkan aplikasi web menggunakan Angular dan React', null,
        'Budi Santoso', 'Engineering Manager', '+62',
        '81298765432', 'budi@teknologimaju.com',
        'system', NOW(), NOW(), $1
      )
    `,
      [profileId],
    );
    console.log("✅ Work experience seeded");

    // CERTIFICATION
    console.log("🌱 Seeding certification...");
    await pool.query(
      `
      INSERT INTO certifications (
        id, name, issuer, "issuedDay", "issuedMonth", "issuedYear",
        "expiredDay", "expiredMonth", "expiredYear",
        "updatedBy", "createdAt", "updatedAt", applicant_profile_id
      ) VALUES (
        gen_random_uuid(), 'AWS Certified Developer', 'Amazon Web Services',
        '1', '6', '2023', '1', '6', '2026',
        'system', NOW(), NOW(), $1
      )
    `,
      [profileId],
    );
    console.log("✅ Certification seeded");

    // LANGUAGE
    console.log("🌱 Seeding languages...");
    await pool.query(
      `
      INSERT INTO languages (
        id, language, proficiency,
        "updatedBy", "createdAt", "updatedAt", applicant_profile_id
      ) VALUES
        (gen_random_uuid(), 'Indonesia', 'Native', 'system', NOW(), NOW(), $1),
        (gen_random_uuid(), 'English', 'Professional', 'system', NOW(), NOW(), $1)
    `,
      [profileId],
    );
    console.log("✅ Languages seeded");

    // TECHNICAL SKILLS
    console.log("🌱 Seeding technical skills...");
    await pool.query(
      `
      INSERT INTO technical_skills (
        id, "skillName",
        "updatedBy", "createdAt", "updatedAt", applicant_profile_id
      ) VALUES
        (gen_random_uuid(), 'Angular', 'system', NOW(), NOW(), $1),
        (gen_random_uuid(), 'TypeScript', 'system', NOW(), NOW(), $1),
        (gen_random_uuid(), 'Node.js', 'system', NOW(), NOW(), $1),
        (gen_random_uuid(), 'PostgreSQL', 'system', NOW(), NOW(), $1)
    `,
      [profileId],
    );
    console.log("✅ Technical skills seeded");
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
