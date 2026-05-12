import pool from "../../configurations/database";

// ============================================================
// SEED DATA
// ============================================================

const APPLICANT_PROFILE_SEED = [
  {
    id: "88d3b107-e970-433c-8868-364d0a11edde",
    user_id: "eb6e7d32-886a-4232-9a7b-d1f24d2b45c4",
    full_name: "Raihan Ghani",
    email: "mraihanghaniii@gmail.com",
    birth_place: "Jakarta",
    birth_date: "1998-01-01",
    gender: "Laki-laki",
    phone_code: "+62",
    phone: "81234567890",
    address: "Jl. Mawar No. 1",
    kelurahan: "Kelurahan A",
    kecamatan: "Kecamatan B",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postal_code: "12345",
    linkedin_url: "https://linkedin.com/in/mraihanghani",
    avatar_url: null,
    cv_url: null,
    cv_file_name: null,
    is_active: true,
  },
  {
    id: "c3f5a2e1-7b4d-4c8a-9e6f-d1a0b2c3e4f5",
    user_id: "484cc8bc-8f5e-4b15-a64d-ca9f333cf55f",
    full_name: "User Kedua",
    email: "user2@example.com",
    birth_place: "Bandung",
    birth_date: "2000-05-10",
    gender: "Laki-laki",
    phone_code: "+62",
    phone: "81398765432",
    address: "Jl. Melati No. 2",
    kelurahan: "Kelurahan C",
    kecamatan: "Kecamatan D",
    city: "Bandung",
    province: "Jawa Barat",
    postal_code: "40123",
    linkedin_url: "https://linkedin.com/in/userkedua",
    avatar_url: null,
    cv_url: null,
    cv_file_name: null,
    is_active: true,
  },
];

const EDUCATION_SEED = [
  {
    profile_id: "88d3b107-e970-433c-8868-364d0a11edde",
    user_id: "eb6e7d32-886a-4232-9a7b-d1f24d2b45c4",
    level: "S1",
    country: "Indonesia",
    institution: "Universitas Indonesia",
    major: "Informatika",
    is_still_studying: false,
    start_day: "28",
    start_month: "12",
    start_year: "2018",
    end_day: "28",
    end_month: "12",
    end_year: "2022",
    gpa: "3.8",
    gpa_scale: "4.0",
  },
];

const WORK_EXPERIENCE_SEED = [
  {
    profile_id: "88d3b107-e970-433c-8868-364d0a11edde",
    user_id: "eb6e7d32-886a-4232-9a7b-d1f24d2b45c4",
    company: "PT Maju Mundur",
    industry: "Media",
    position: "Frontend Developer",
    employment_type: "Full-time",
    job_level: "Staff",
    team_size: "5",
    start_day: "01",
    start_month: "01",
    start_year: "2022",
    end_day: null,
    end_month: null,
    end_year: null,
    is_current_job: true,
    responsibilities: "Develop Angular applications, optimize UI performance, collaborate with backend team, and implement responsive design.",
    leave_reason: null,
    reference_name: "Budi Santoso",
    reference_position: "Engineering Manager",
    reference_phone_code: "+62",
    reference_phone: "81234567890",
    reference_email: "budi.santoso@majumundur.co.id",
  },
];

const CERTIFICATION_SEED = [
  {
    profile_id: "88d3b107-e970-433c-8868-364d0a11edde",
    user_id: "eb6e7d32-886a-4232-9a7b-d1f24d2b45c4",
    name: "AWS Developer",
    issuer: "AWS",
    issued_day: "15",
    issued_month: "6",
    issued_year: "2023",
    expired_day: "21",
    expired_month: "6",
    expired_year: "2026",
  },
];

const LANGUAGE_SEED = [
  { profile_id: "88d3b107-e970-433c-8868-364d0a11edde", user_id: "eb6e7d32-886a-4232-9a7b-d1f24d2b45c4", language: "Indonesia", proficiency: "Native", is_active: true },
  { profile_id: "88d3b107-e970-433c-8868-364d0a11edde", user_id: "eb6e7d32-886a-4232-9a7b-d1f24d2b45c4", language: "Inggris", proficiency: "Menengah", is_active: true },
];

const TECHNICAL_SKILL_SEED = [
  { profile_id: "88d3b107-e970-433c-8868-364d0a11edde", user_id: "eb6e7d32-886a-4232-9a7b-d1f24d2b45c4", skill_name: "Angular", is_active: true },
  { profile_id: "88d3b107-e970-433c-8868-364d0a11edde", user_id: "eb6e7d32-886a-4232-9a7b-d1f24d2b45c4", skill_name: "TypeScript", is_active: true },
  { profile_id: "88d3b107-e970-433c-8868-364d0a11edde", user_id: "eb6e7d32-886a-4232-9a7b-d1f24d2b45c4", skill_name: "Node.js", is_active: true },
];

// ============================================================
// SEED FUNCTIONS
// ============================================================

export async function seedApplicantProfiles() {
  for (const profile of APPLICANT_PROFILE_SEED) {
    await pool.query(
      `INSERT INTO applicant_profiles (
        id, user_id, full_name, email, birth_place, birth_date, gender,
        phone_code, phone, address, kelurahan, kecamatan, city, province, postal_code,
        linkedin_url, avatar_url, cv_url, cv_file_name,
        is_active, created_at, updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,NOW(),NOW())
      ON CONFLICT (id) DO NOTHING`,
      [
        profile.id,
        profile.user_id,
        profile.full_name,
        profile.email,
        profile.birth_place,
        profile.birth_date,
        profile.gender,
        profile.phone_code,
        profile.phone,
        profile.address,
        profile.kelurahan,
        profile.kecamatan,
        profile.city,
        profile.province,
        profile.postal_code,
        profile.linkedin_url,
        profile.avatar_url,
        profile.cv_url,
        profile.cv_file_name,
        profile.is_active,
      ],
    );
  }
  console.log("✅ Applicant profiles seeded");

  for (const education of EDUCATION_SEED) {
    await pool.query(
      `INSERT INTO educations (
        applicant_profile_id, level, country, institution, major,
        is_still_studying, start_day, start_month, start_year,
        end_day, end_month, end_year, gpa, gpa_scale,
        created_at, created_by, updated_at, updated_by
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),$15,NOW(),$15)`,
      [
        education.profile_id,
        education.level,
        education.country,
        education.institution,
        education.major,
        education.is_still_studying,
        education.start_day,
        education.start_month,
        education.start_year,
        education.end_day,
        education.end_month,
        education.end_year,
        education.gpa,
        education.gpa_scale,
        education.user_id,
      ],
    );
  }
  console.log("✅ Educations seeded");

  for (const work of WORK_EXPERIENCE_SEED) {
    await pool.query(
      `INSERT INTO work_experiences (
        applicant_profile_id, company, industry, position, employment_type,
        job_level, team_size, start_day, start_month, start_year,
        end_day, end_month, end_year, is_current_job, responsibilities,
        leave_reason, reference_name, reference_position, reference_phone_code,
        reference_phone, reference_email,
        created_at, created_by, updated_at, updated_by
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,NOW(),$22,NOW(),$22)`,
      [
        work.profile_id,
        work.company,
        work.industry,
        work.position,
        work.employment_type,
        work.job_level,
        work.team_size,
        work.start_day,
        work.start_month,
        work.start_year,
        work.end_day,
        work.end_month,
        work.end_year,
        work.is_current_job,
        work.responsibilities,
        work.leave_reason,
        work.reference_name,
        work.reference_position,
        work.reference_phone_code,
        work.reference_phone,
        work.reference_email,
        work.user_id,
      ],
    );
  }
  console.log("✅ Work experiences seeded");

  for (const cert of CERTIFICATION_SEED) {
    await pool.query(
      `INSERT INTO certifications (
        applicant_profile_id, name, issuer,
        issued_day, issued_month, issued_year,
        expired_day, expired_month, expired_year,
        created_at, created_by, updated_at, updated_by
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),$10,NOW(),$10)`,
      [cert.profile_id, cert.name, cert.issuer, cert.issued_day, cert.issued_month, cert.issued_year, cert.expired_day, cert.expired_month, cert.expired_year, cert.user_id],
    );
  }
  console.log("✅ Certifications seeded");

  for (const lang of LANGUAGE_SEED) {
    await pool.query(
      `INSERT INTO languages (applicant_profile_id, language, proficiency, is_active, created_at, created_by, updated_at, updated_by)
       VALUES ($1, $2, $3, $4, NOW(), $5, NOW(), $5)`,
      [lang.profile_id, lang.language, lang.proficiency, lang.is_active, lang.user_id],
    );
  }
  console.log("✅ Languages seeded");

  for (const skill of TECHNICAL_SKILL_SEED) {
    await pool.query(
      `INSERT INTO technical_skills (applicant_profile_id, skill_name, is_active, created_at, created_by, updated_at, updated_by)
       VALUES ($1, $2, $3, NOW(), $4, NOW(), $4)`,
      [skill.profile_id, skill.skill_name, skill.is_active, skill.user_id],
    );
  }
  console.log("✅ Technical skills seeded");
}
