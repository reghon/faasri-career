import pool from "../../configurations/database";

const EMPLOYMENT_TYPE_SEED = [
  { code: "FULL_TIME", name: "Full Time", description: "Pekerjaan dengan jam kerja penuh (biasanya 40 jam per minggu)", is_active: true },
  { code: "PART_TIME", name: "Part Time", description: "Pekerjaan dengan jam kerja lebih sedikit dari full time", is_active: true },
  { code: "CONTRACT", name: "Contract", description: "Pekerjaan berdasarkan kontrak dengan durasi tertentu", is_active: true },
  { code: "FREELANCE", name: "Freelance", description: "Pekerjaan berbasis proyek tanpa ikatan kerja tetap", is_active: true },
  { code: "INTERNSHIP", name: "Internship", description: "Program magang untuk mendapatkan pengalaman kerja", is_active: true },
];

const JOB_CATEGORY_SEED = [
  { code: "ENGINEERING", name: "Engineering", description: "Pekerjaan di bidang pengembangan teknologi dan perangkat lunak", is_active: true },
  { code: "MARKETING", name: "Marketing", description: "Pekerjaan di bidang pemasaran dan promosi produk atau layanan", is_active: true },
  { code: "FINANCE", name: "Finance", description: "Pekerjaan yang berkaitan dengan keuangan dan akuntansi", is_active: true },
  { code: "HUMAN_RESOURCES", name: "Human Resources", description: "Pekerjaan yang berkaitan dengan pengelolaan SDM", is_active: true },
  { code: "SALES", name: "Sales", description: "Pekerjaan yang berfokus pada penjualan produk atau layanan", is_active: true },
  { code: "OPERATIONS", name: "Operations", description: "Pekerjaan yang berkaitan dengan operasional bisnis", is_active: true },
  { code: "DESIGN", name: "Design", description: "Pekerjaan di bidang desain visual dan pengalaman pengguna", is_active: true },
  { code: "PRODUCT", name: "Product", description: "Pekerjaan dalam pengelolaan dan pengembangan produk", is_active: true },
  { code: "CUSTOMER_SERVICE", name: "Customer Service", description: "Pekerjaan yang berfokus pada pelayanan pelanggan", is_active: true },
];

const DEPARTMENT_SEED = [
  { code: "ENG_BE", name: "Backend Engineering", description: "Tim yang bertanggung jawab untuk pengembangan backend sistem", is_active: true },
  { code: "ENG_FE", name: "Frontend Engineering", description: "Tim yang bertanggung jawab untuk pengembangan frontend aplikasi", is_active: true },
  { code: "ENG_DEVOPS", name: "DevOps", description: "Tim yang mengelola infrastruktur dan deployment", is_active: true },
  { code: "HR_RECRUITMENT", name: "Recruitment", description: "Tim yang bertanggung jawab dalam proses rekrutmen", is_active: true },
  { code: "HR_TALENT", name: "Talent Management", description: "Tim yang mengelola pengembangan dan retensi karyawan", is_active: true },
  { code: "FIN_ACCOUNTING", name: "Accounting", description: "Tim yang mengelola pencatatan dan laporan keuangan", is_active: true },
  { code: "MKT_DIGITAL", name: "Digital Marketing", description: "Tim yang menangani pemasaran digital", is_active: true },
  { code: "SALES_B2B", name: "B2B Sales", description: "Tim yang menangani penjualan ke bisnis", is_active: true },
  { code: "OPS_GENERAL", name: "Operations", description: "Tim yang menangani operasional harian perusahaan", is_active: true },
];

const EDUCATION_LEVEL_SEED = [
  { code: "SMA", name: "SMA/SMK", name_en: "Senior High School / Vocational School", description: "Pendidikan menengah atas atau kejuruan", level_order: 3, is_active: true },
  { code: "D1", name: "Diploma 1", name_en: "Diploma 1", description: "Program diploma 1 tahun", level_order: 4, is_active: true },
  { code: "D2", name: "Diploma 2", name_en: "Diploma 2", description: "Program diploma 2 tahun", level_order: 5, is_active: true },
  { code: "D3", name: "Diploma 3", name_en: "Diploma 3", description: "Program diploma 3 tahun", level_order: 6, is_active: true },
  { code: "D4", name: "Diploma 4", name_en: "Applied Bachelor (D4)", description: "Setara sarjana terapan", level_order: 7, is_active: true },
  { code: "S1", name: "Sarjana", name_en: "Bachelor Degree", description: "Program strata 1", level_order: 8, is_active: true },
  { code: "S2", name: "Magister", name_en: "Master Degree", description: "Program strata 2", level_order: 9, is_active: true },
  { code: "S3", name: "Doktor", name_en: "Doctoral Degree", description: "Program strata 3", level_order: 10, is_active: true },
];

const JOB_STATUS_SEED = [
  { code: "DRAFT", name: "Draft", description: "Lowongan masih dalam tahap draft dan belum dipublikasikan", is_active: true },
  { code: "OPEN", name: "Open", description: "Lowongan sedang dibuka dan menerima lamaran", is_active: true },
  { code: "PAUSED", name: "Paused", description: "Lowongan dihentikan sementara dan tidak menerima lamaran", is_active: true },
  { code: "CLOSED", name: "Closed", description: "Lowongan telah ditutup dan tidak menerima lamaran", is_active: true },
  { code: "FILLED", name: "Filled", description: "Posisi telah terisi oleh kandidat", is_active: true },
];

const JOB_LOCATION_SEED = [
  { code: "JKT_KELAPA_GADING", name: "Kelapa Gading Office", city: "Jakarta Utara", province: "DKI Jakarta", country: "Indonesia", address: "Jl. Boulevard Raya Kelapa Gading", postal_code: "14240", is_active: true },
  { code: "BGR_TIMUR", name: "Bogor Timur Office", city: "Kota Bogor", province: "Jawa Barat", country: "Indonesia", address: "Jl. Raya Tajur, Bogor Timur", postal_code: "16141", is_active: true },
  { code: "BSD_TANGERANG", name: "BSD Office", city: "Tangerang Selatan", province: "Banten", country: "Indonesia", address: "Jl. BSD Green Office Park", postal_code: "15345", is_active: true },
];

const WORK_MODE_SEED = [
  { code: "ONSITE", name: "Onsite", is_active: true },
  { code: "HYBRID", name: "Hybrid", is_active: true },
  { code: "REMOTE", name: "Remote", is_active: true },
];

export async function seedMasterData() {
  for (const item of EMPLOYMENT_TYPE_SEED) {
    await pool.query(
      `INSERT INTO employment_types (name, code, description, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) ON CONFLICT (code) DO NOTHING`,
      [item.name, item.code, item.description, item.is_active],
    );
  }
  console.log("✅ Employment types seeded");

  for (const item of JOB_CATEGORY_SEED) {
    await pool.query(
      `INSERT INTO job_categories (name, code, description, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) ON CONFLICT (code) DO NOTHING`,
      [item.name, item.code, item.description, item.is_active],
    );
  }
  console.log("✅ Job categories seeded");

  for (const item of DEPARTMENT_SEED) {
    await pool.query(
      `INSERT INTO departments (code, name, description, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) ON CONFLICT (code) DO NOTHING`,
      [item.code, item.name, item.description, item.is_active],
    );
  }
  console.log("✅ Departments seeded");

  for (const item of EDUCATION_LEVEL_SEED) {
    await pool.query(
      `INSERT INTO education_levels (code, name, description, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) ON CONFLICT (code) DO NOTHING`,
      [item.code, item.name, item.description, item.is_active],
    );
  }
  console.log("✅ Education levels seeded");

  for (const item of JOB_STATUS_SEED) {
    await pool.query(
      `INSERT INTO job_statuses (code, name, description, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) ON CONFLICT (code) DO NOTHING`,
      [item.code, item.name, item.description, item.is_active],
    );
  }
  console.log("✅ Job statuses seeded");

  for (const item of JOB_LOCATION_SEED) {
    await pool.query(
      `INSERT INTO job_locations (code, name, city, province, country, address, postal_code, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) ON CONFLICT (code) DO NOTHING`,
      [item.code, item.name, item.city, item.province, item.country, item.address, item.postal_code, item.is_active],
    );
  }
  console.log("✅ Job locations seeded");

  for (const item of WORK_MODE_SEED) {
    await pool.query(
      `INSERT INTO work_modes (code, name, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW()) ON CONFLICT (code) DO NOTHING`,
      [item.code, item.name, item.is_active],
    );
  }
  console.log("✅ Work modes seeded");
}
