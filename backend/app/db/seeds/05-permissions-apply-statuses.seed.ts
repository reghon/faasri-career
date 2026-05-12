import pool from "../../configurations/database";

const APPLY_STATUS_SEED = [
  { code: "submitted", name: "Submitted", description: "Lamaran telah dikirim oleh kandidat", is_active: true },
  { code: "screening", name: "Screening", description: "Lamaran sedang dalam proses seleksi awal oleh HR", is_active: true },
  { code: "interview", name: "Interview", description: "Kandidat sedang menjalani proses wawancara", is_active: true },
  { code: "technical_test", name: "Technical Test", description: "Kandidat sedang mengikuti tes teknis", is_active: true },
  { code: "offered", name: "Offered", description: "Penawaran kerja telah diberikan kepada kandidat", is_active: true },
  { code: "hired", name: "Hired", description: "Kandidat menerima penawaran dan resmi direkrut", is_active: true },
  { code: "rejected", name: "Rejected", description: "Kandidat tidak lolos dalam proses seleksi", is_active: true },
  { code: "withdrawn", name: "Withdrawn", description: "Kandidat mengundurkan diri dari proses lamaran", is_active: true },
];

export async function seedApplyStatuses() {
  for (const status of APPLY_STATUS_SEED) {
    await pool.query(
      `INSERT INTO apply_statuses (code, name, description, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) ON CONFLICT (code) DO NOTHING`,
      [status.code, status.name, status.description, status.is_active],
    );
  }
  console.log("✅ Apply statuses seeded");
}

export async function seedPermissions() {
  await pool.query(`
    INSERT INTO modules (code, name, description, is_active, created_at, updated_at)
    VALUES
      ('JOB', 'Job', 'Module for managing job postings', true, NOW(), NOW()),
      ('APPLICANT', 'Applicant', 'Module for managing applicants', true, NOW(), NOW()),
      ('APPLICATION', 'Application', 'Module for managing job applications', true, NOW(), NOW()),
      ('MASTER_DATA', 'Master Data', 'Module for managing master data', true, NOW(), NOW())
    ON CONFLICT (code) DO NOTHING
  `);
  console.log("✅ Modules seeded");

  await pool.query(`
    INSERT INTO permission_actions (code, name, description, is_active, created_at, updated_at)
    VALUES
      ('CREATE', 'Create', 'Permission to create data', true, NOW(), NOW()),
      ('READ', 'Read', 'Permission to read data', true, NOW(), NOW()),
      ('UPDATE', 'Update', 'Permission to update data', true, NOW(), NOW()),
      ('DELETE', 'Delete', 'Permission to delete data', true, NOW(), NOW())
    ON CONFLICT (code) DO NOTHING
  `);
  console.log("✅ Permission actions seeded");

  await pool.query(`
    INSERT INTO permissions (module_id, permission_action_id, code, name, description, is_active, created_at, updated_at)
    VALUES
      ((SELECT id FROM modules WHERE code = 'JOB'), (SELECT id FROM permission_actions WHERE code = 'CREATE'), 'JOB_CREATE', 'Job Create', 'Permission to create job data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'JOB'), (SELECT id FROM permission_actions WHERE code = 'READ'), 'JOB_READ', 'Job Read', 'Permission to read job data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'JOB'), (SELECT id FROM permission_actions WHERE code = 'UPDATE'), 'JOB_UPDATE', 'Job Update', 'Permission to update job data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'JOB'), (SELECT id FROM permission_actions WHERE code = 'DELETE'), 'JOB_DELETE', 'Job Delete', 'Permission to delete job data', true, NOW(), NOW()),

      ((SELECT id FROM modules WHERE code = 'APPLICANT'), (SELECT id FROM permission_actions WHERE code = 'CREATE'), 'APPLICANT_CREATE', 'Applicant Create', 'Permission to create applicant data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'APPLICANT'), (SELECT id FROM permission_actions WHERE code = 'READ'), 'APPLICANT_READ', 'Applicant Read', 'Permission to read applicant data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'APPLICANT'), (SELECT id FROM permission_actions WHERE code = 'UPDATE'), 'APPLICANT_UPDATE', 'Applicant Update', 'Permission to update applicant data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'APPLICANT'), (SELECT id FROM permission_actions WHERE code = 'DELETE'), 'APPLICANT_DELETE', 'Applicant Delete', 'Permission to delete applicant data', true, NOW(), NOW()),

      ((SELECT id FROM modules WHERE code = 'APPLICATION'), (SELECT id FROM permission_actions WHERE code = 'CREATE'), 'APPLICATION_CREATE', 'Application Create', 'Permission to create application data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'APPLICATION'), (SELECT id FROM permission_actions WHERE code = 'READ'), 'APPLICATION_READ', 'Application Read', 'Permission to read application data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'APPLICATION'), (SELECT id FROM permission_actions WHERE code = 'UPDATE'), 'APPLICATION_UPDATE', 'Application Update', 'Permission to update application data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'APPLICATION'), (SELECT id FROM permission_actions WHERE code = 'DELETE'), 'APPLICATION_DELETE', 'Application Delete', 'Permission to delete application data', true, NOW(), NOW()),

      ((SELECT id FROM modules WHERE code = 'MASTER_DATA'), (SELECT id FROM permission_actions WHERE code = 'CREATE'), 'MASTER_DATA_CREATE', 'Master Data Create', 'Permission to create master data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'MASTER_DATA'), (SELECT id FROM permission_actions WHERE code = 'READ'), 'MASTER_DATA_READ', 'Master Data Read', 'Permission to read master data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'MASTER_DATA'), (SELECT id FROM permission_actions WHERE code = 'UPDATE'), 'MASTER_DATA_UPDATE', 'Master Data Update', 'Permission to update master data', true, NOW(), NOW()),
      ((SELECT id FROM modules WHERE code = 'MASTER_DATA'), (SELECT id FROM permission_actions WHERE code = 'DELETE'), 'MASTER_DATA_DELETE', 'Master Data Delete', 'Permission to delete master data', true, NOW(), NOW())
    ON CONFLICT (module_id, permission_action_id) DO NOTHING
  `);
  console.log("✅ Permissions seeded");
}
