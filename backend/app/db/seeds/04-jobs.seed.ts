import pool from "../../configurations/database";
import { USER_SEED } from "./01-roles-users.seed";

const JOB_SEED = [
  {
    title: "Frontend Developer",
    slug: "frontend-developer",
    category_code: "ENGINEERING",
    employment_type_code: "FULL_TIME",
    status_code: "OPEN",
    job_location_code: "JKT_KELAPA_GADING",
    education_level_code: "S1",
    department_code: "ENG_FE",
    work_mode_code: "HYBRID",
    management_profile_id: "fbb1fd25-e29c-474b-a622-0e51c3e336bd",
    description: `
      <p>Membangun <strong>UI modern</strong> dan responsif untuk aplikasi web perusahaan.</p>
      <p>Kandidat akan berperan dalam menciptakan pengalaman pengguna yang <em>intuitif</em>, cepat, dan konsisten di berbagai perangkat.</p>
      <p><u>Fokus utama</u> posisi ini adalah kualitas antarmuka, maintainability, dan kolaborasi lintas tim.</p>
    `,
    requirements: `
      <ul>
        <li>Menguasai <strong>React</strong> atau <strong>Vue</strong>.</li>
        <li>Memahami <em>HTML</em>, <em>CSS</em>, dan <em>JavaScript</em>.</li>
        <li>Berpengalaman menggunakan <u>REST API</u>.</li>
        <li>Terbiasa menggunakan Git untuk version control.</li>
        <li>Memahami prinsip <strong>responsive design</strong>.</li>
      </ul>
    `,
    responsibilities: `
      <ul>
        <li>Mengembangkan UI aplikasi web yang <strong>rapi</strong> dan scalable.</li>
        <li>Meningkatkan pengalaman pengguna melalui pendekatan <em>user-centered</em>.</li>
        <li>Melakukan debugging dan perbaikan issue frontend.</li>
        <li>Mengoptimalkan performa tampilan aplikasi.</li>
        <li>Melakukan <u>code review</u> bersama tim engineering.</li>
      </ul>
    `,
    benefits: "BPJS, Laptop",
    min_salary: 8000000,
    max_salary: 12000000,
    currency_code: "IDR",
    salary_type: "month",
    vacancy_count: 1,
    experience_min_years: 1,
    close_at: "2026-12-31 23:59:59",
    is_active: true,
  },
  {
    title: "Digital Marketing Specialist",
    slug: "digital-marketing-specialist",
    category_code: "MARKETING",
    employment_type_code: "FULL_TIME",
    status_code: "OPEN",
    job_location_code: "BSD_TANGERANG",
    education_level_code: "S1",
    department_code: "MKT_DIGITAL",
    work_mode_code: "ONSITE",
    management_profile_id: "fbb1fd25-e29c-474b-a622-0e51c3e336bd",
    description: `
      <p>Mengelola kampanye digital dan meningkatkan <strong>brand awareness</strong> perusahaan.</p>
      <p>Posisi ini membutuhkan kreativitas, kemampuan analisis, dan pemahaman kanal pemasaran digital secara <em>menyeluruh</em>.</p>
      <p><u>Tujuan utama</u> adalah meningkatkan performa campaign dan mendukung pertumbuhan bisnis.</p>
    `,
    requirements: `
      <ul>
        <li>Memahami strategi <strong>SEO</strong> dan <strong>SEM</strong>.</li>
        <li>Berpengalaman menjalankan iklan digital seperti Meta Ads atau Google Ads.</li>
        <li>Mampu membaca data melalui tools <em>analytics</em>.</li>
        <li>Memiliki kemampuan membuat dan mengelola content plan.</li>
        <li>Aktif mengikuti tren <u>social media</u>.</li>
      </ul>
    `,
    responsibilities: `
      <ul>
        <li>Menjalankan campaign digital secara terukur.</li>
        <li>Mengoptimalkan performa iklan berdasarkan data.</li>
        <li>Menganalisis hasil campaign dan menyusun insight.</li>
        <li>Membuat strategi konten yang <strong>relevan</strong> dengan target audiens.</li>
        <li>Menyusun laporan performa secara <em>berkala</em>.</li>
      </ul>
    `,
    benefits: "BPJS, Bonus",
    min_salary: 7000000,
    max_salary: 12000000,
    currency_code: "IDR",
    salary_type: "month",
    vacancy_count: 1,
    experience_min_years: 2,
    close_at: "2026-12-31 23:59:59",
    is_active: true,
  },
  {
    title: "Backend Developer",
    slug: "backend-developer",
    category_code: "ENGINEERING",
    employment_type_code: "CONTRACT",
    status_code: "OPEN",
    job_location_code: "BGR_TIMUR",
    education_level_code: "S1",
    department_code: "ENG_BE",
    work_mode_code: "REMOTE",
    management_profile_id: "fbb1fd25-e29c-474b-a622-0e51c3e336bd",
    description: `
      <p>Mengembangkan <strong>API</strong> dan sistem backend yang scalable untuk mendukung kebutuhan aplikasi perusahaan.</p>
      <p>Kandidat akan bekerja dengan arsitektur server-side, database, integrasi sistem, dan praktik pengembangan yang <em>secure</em>.</p>
      <p><u>Fokus utama</u> posisi ini adalah performa, keamanan, dan reliabilitas layanan backend.</p>
    `,
    requirements: `
      <ul>
        <li>Menguasai <strong>Node.js</strong> atau <strong>Golang</strong>.</li>
        <li>Memahami konsep database relasional maupun non-relasional.</li>
        <li>Berpengalaman menggunakan <em>Docker</em>.</li>
        <li>Mampu membangun dan mengelola <u>REST API</u>.</li>
        <li>Terbiasa menggunakan Git dalam workflow development.</li>
      </ul>
    `,
    responsibilities: `
      <ul>
        <li>Membangun API yang <strong>stabil</strong>, aman, dan terdokumentasi.</li>
        <li>Melakukan maintenance sistem backend secara berkala.</li>
        <li>Mengoptimalkan query dan performa database.</li>
        <li>Menerapkan praktik keamanan aplikasi backend.</li>
        <li>Melakukan integrasi dengan layanan internal maupun eksternal.</li>
      </ul>
    `,
    benefits: "BPJS",
    min_salary: 9000000,
    max_salary: 15000000,
    currency_code: "IDR",
    salary_type: "month",
    vacancy_count: 2,
    experience_min_years: 2,
    close_at: "2026-12-31 23:59:59",
    is_active: true,
  },
  {
    title: "HR Recruiter",
    slug: "hr-recruiter",
    category_code: "HUMAN_RESOURCES",
    employment_type_code: "FULL_TIME",
    status_code: "OPEN",
    job_location_code: "JKT_KELAPA_GADING",
    education_level_code: "S1",
    department_code: "HR_RECRUITMENT",
    work_mode_code: "ONSITE",
    management_profile_id: "fbb1fd25-e29c-474b-a622-0e51c3e336bd",
    description: `<p>Mengelola proses rekrutmen end-to-end untuk memenuhi kebutuhan tenaga kerja perusahaan.</p>`,
    requirements: `<ul><li>Pengalaman minimal 1 tahun di bidang rekrutmen.</li><li>Mampu mengelola multiple hiring pipeline.</li></ul>`,
    responsibilities: `<ul><li>Melakukan sourcing kandidat dari berbagai channel.</li><li>Melakukan screening dan wawancara awal.</li></ul>`,
    benefits: "BPJS",
    min_salary: 7000000,
    max_salary: 11000000,
    currency_code: "IDR",
    salary_type: "month",
    vacancy_count: 1,
    experience_min_years: 1,
    close_at: "2026-12-31 23:59:59",
    is_active: true,
  },
  {
    title: "UI/UX Designer",
    slug: "ui-ux-designer",
    category_code: "DESIGN",
    employment_type_code: "FREELANCE",
    status_code: "OPEN",
    job_location_code: "BGR_TIMUR",
    education_level_code: "S1",
    department_code: "OPS_GENERAL",
    work_mode_code: "REMOTE",
    management_profile_id: "fbb1fd25-e29c-474b-a622-0e51c3e336bd",
    description: `
      <p>Merancang pengalaman pengguna yang <strong>optimal</strong> untuk produk digital perusahaan.</p>
      <p>Kandidat akan membuat desain visual, alur interaksi, wireframe, dan prototype dengan pendekatan <em>user-centered design</em>.</p>
      <p><u>Fokus utama</u> posisi ini adalah usability, konsistensi visual, dan validasi desain berdasarkan kebutuhan pengguna.</p>
    `,
    requirements: `
      <ul>
        <li>Menguasai tools desain seperti <strong>Figma</strong>.</li>
        <li>Memahami proses <em>UX research</em>.</li>
        <li>Mampu membuat <u>wireframe</u> dan user flow.</li>
        <li>Berpengalaman membuat prototype interaktif.</li>
      </ul>
    `,
    responsibilities: `
      <ul>
        <li>Membuat desain UI yang <strong>menarik</strong>, konsisten, dan mudah digunakan.</li>
        <li>Melakukan user research untuk memahami kebutuhan pengguna.</li>
        <li>Berkolaborasi dengan developer dan tim produk secara <em>aktif</em>.</li>
      </ul>
    `,
    benefits: "Project based",
    min_salary: 5000000,
    max_salary: 9000000,
    currency_code: "IDR",
    salary_type: "month",
    vacancy_count: 1,
    experience_min_years: 1,
    close_at: "2026-12-31 23:59:59",
    is_active: true,
  },
  {
    title: "B2B Sales Executive",
    slug: "b2b-sales-executive",
    category_code: "SALES",
    employment_type_code: "FULL_TIME",
    status_code: "OPEN",
    job_location_code: "JKT_KELAPA_GADING",
    education_level_code: "S1",
    department_code: "SALES_B2B",
    work_mode_code: "ONSITE",
    management_profile_id: "fbb1fd25-e29c-474b-a622-0e51c3e336bd",
    description: `
      <p>Menjalin hubungan dengan klien bisnis dan mengembangkan peluang penjualan <strong>B2B</strong>.</p>
      <p><u>Fokus utama</u> posisi ini adalah akuisisi klien, pencapaian target, dan pengelolaan relasi bisnis jangka panjang.</p>
    `,
    requirements: `
      <ul>
        <li>Memiliki kemampuan <strong>negotiation</strong> yang baik.</li>
        <li>Terbiasa menggunakan <u>CRM</u> atau sales tracking tools.</li>
      </ul>
    `,
    responsibilities: `
      <ul>
        <li>Melakukan prospecting klien bisnis secara <strong>aktif</strong>.</li>
        <li>Mencapai target penjualan yang telah ditentukan.</li>
      </ul>
    `,
    benefits: "BPJS, Bonus",
    min_salary: 6000000,
    max_salary: 12000000,
    currency_code: "IDR",
    salary_type: "month",
    vacancy_count: 2,
    experience_min_years: 1,
    close_at: "2026-12-31 23:59:59",
    is_active: true,
  },
];

export async function seedJobs() {
  for (const job of JOB_SEED) {
    const category = await pool.query(`SELECT id FROM job_categories WHERE code = $1 LIMIT 1`, [job.category_code]);
    const employmentType = await pool.query(`SELECT id FROM employment_types WHERE code = $1 LIMIT 1`, [job.employment_type_code]);
    const status = await pool.query(`SELECT id FROM job_statuses WHERE code = $1 LIMIT 1`, [job.status_code]);
    const location = await pool.query(`SELECT id FROM job_locations WHERE code = $1 LIMIT 1`, [job.job_location_code]);
    const educationLevel = await pool.query(`SELECT id FROM education_levels WHERE code = $1 LIMIT 1`, [job.education_level_code]);
    const department = await pool.query(`SELECT id FROM departments WHERE code = $1 LIMIT 1`, [job.department_code]);
    const workMode = await pool.query(`SELECT id FROM work_modes WHERE code = $1 LIMIT 1`, [job.work_mode_code]);

    await pool.query(
      `INSERT INTO jobs (
        category_id, employment_type_id, status_id, job_location_id,
        education_level_id, department_id, work_mode_id,
        title, slug, description, requirements, responsibilities, benefits,
        min_salary, max_salary, currency_code, salary_type, vacancy_count,
        experience_min_years, published_at, close_at, is_active,
        created_at, created_by, updated_at, updated_by, management_profile_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,NOW(),$20,$21,NOW(),$22,NOW(),$22,$23)
      ON CONFLICT (slug) DO NOTHING`,
      [
        category.rows[0].id,
        employmentType.rows[0].id,
        status.rows[0].id,
        location.rows[0].id,
        educationLevel.rows[0].id,
        department.rows[0].id,
        workMode.rows[0].id,
        job.title,
        job.slug,
        job.description,
        job.requirements,
        job.responsibilities,
        job.benefits,
        job.min_salary,
        job.max_salary,
        job.currency_code,
        job.salary_type,
        job.vacancy_count,
        job.experience_min_years,
        job.close_at,
        job.is_active,
        USER_SEED[0].id,
        job.management_profile_id,
      ],
    );
  }
  console.log("✅ Jobs seeded");
}
