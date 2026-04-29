const SELECT_FIELDS = `
  sj.id,
  sj.user_id,
  sj.job_id,
  sj.is_active
`;

const LIST_FIELDS = `
  j.id,
  j.title,
  j.slug,
  j.min_salary,
  j.max_salary,
  j.currency_code,
  j.salary_type,
  j.vacancy_count,
  j.experience_min_years,
  j.published_at,
  j.close_at,
  j.is_active,
  jc.name AS category_name,
  et.name AS employment_type_name,
  js.name AS status_name,
  jl.name AS job_location_name,
  el.name AS education_level_name,
  d.name AS department_name,
  wm.name AS work_mode_name
`;

const DETAIL_FIELDS = `
  id, user_id, job_id, is_active,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  user_id, job_id, is_active, created_at, created_by, updated_at, updated_by
`;

export const savedJobQueries = {
  getAll: `
    SELECT ${LIST_FIELDS}
    FROM saved_jobs sj
    JOIN jobs j ON j.id = sj.job_id
    JOIN job_categories jc ON jc.id = j.category_id
    JOIN employment_types et ON et.id = j.employment_type_id
    JOIN job_statuses js ON js.id = j.status_id
    JOIN job_locations jl ON jl.id = j.job_location_id
    JOIN education_levels el ON el.id = j.education_level_id
    JOIN departments d ON d.id = j.department_id
    JOIN work_modes wm ON wm.id = j.work_mode_id
    WHERE sj.deleted_at IS NULL
      AND sj.is_active = true
      AND j.deleted_at IS NULL
    ORDER BY sj.created_at DESC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM saved_jobs sj
    WHERE sj.id = $1
      AND sj.deleted_at IS NULL
    LIMIT 1
  `,

  getDetailById: `
    SELECT ${DETAIL_FIELDS}
    FROM saved_jobs
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByUserAndJob: `
    SELECT ${DETAIL_FIELDS}
    FROM saved_jobs
    WHERE user_id = $1
      AND job_id = $2
    LIMIT 1
  `,

  create: `
    INSERT INTO saved_jobs (${INSERT_FIELDS})
    VALUES ($1, $2, $3, NOW(), $4, NOW(), $4)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE saved_jobs
    SET
      user_id = $1,
      job_id = $2,
      is_active = $3,
      updated_at = NOW(),
      updated_by = $4
    WHERE id = $5
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  restore: `
    UPDATE saved_jobs
    SET
      is_active = $3,
      deleted_at = NULL,
      deleted_by = NULL,
      updated_at = NOW(),
      updated_by = $4
    WHERE user_id = $1
      AND job_id = $2
    RETURNING ${SELECT_FIELDS}
  `,

  softDelete: `
    UPDATE saved_jobs
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING ${DETAIL_FIELDS}
  `,
};
