const BASE_FIELDS = `
  id,management_profile_id,category_id,employment_type_id,status_id,job_location_id,education_level_id,department_id,
  work_mode_id,title,slug,description,requirements,responsibilities,
  benefits,min_salary,max_salary,currency_code,salary_type,vacancy_count,experience_min_years,
  published_at,close_at,is_active,created_at,created_by,updated_at,updated_by,
  deleted_at,deleted_by
`;

const LIST_FIELDS = `
  j.id,j.title,j.slug,j.min_salary,j.max_salary,j.currency_code,
  j.salary_type,j.vacancy_count,j.experience_min_years,j.published_at,j.close_at,j.is_active,
  jc.name AS category_name,et.name AS employment_type_name,js.name AS status_name,
  jl.name AS job_location_name,el.name AS education_level_name,d.name AS department_name,
  wm.name AS work_mode_name
`;

const DETAIL_BASE_FIELDS = `
  j.id,j.category_id,j.employment_type_id,j.status_id,j.job_location_id,
  j.education_level_id,j.department_id,j.work_mode_id,j.title,j.slug,j.description,
  j.requirements,j.responsibilities,j.benefits,j.min_salary,j.max_salary,j.currency_code,
  j.salary_type,j.vacancy_count,j.experience_min_years,j.published_at,j.close_at,j.is_active,
  j.created_at,j.created_by,j.updated_at,j.updated_by,j.deleted_at,j.deleted_by
`;

const DETAIL_FIELDS = `
  ${DETAIL_BASE_FIELDS},jc.name AS category_name,et.name AS employment_type_name,
  js.name AS status_name,jl.name AS job_location_name,el.name AS education_level_name,
  d.name AS department_name,wm.name AS work_mode_name, j.management_profile_id,
  mp.full_name AS management_profile_name,
  creator_mp.full_name AS created_by_name
`;
export const jobQueries = {
  countAll: `
    SELECT COUNT(*)::int AS total
    FROM jobs j
    WHERE j.deleted_at IS NULL
  `,

  getAll: `
    SELECT ${LIST_FIELDS}
    FROM jobs j
    JOIN job_categories jc ON jc.id = j.category_id
    JOIN employment_types et ON et.id = j.employment_type_id
    JOIN job_statuses js ON js.id = j.status_id
    JOIN job_locations jl ON jl.id = j.job_location_id
    JOIN education_levels el ON el.id = j.education_level_id
    JOIN departments d ON d.id = j.department_id
    JOIN work_modes wm ON wm.id = j.work_mode_id
    WHERE j.deleted_at IS NULL
    ORDER BY j.created_at DESC
    LIMIT $1 OFFSET $2
  `,

  countAllOpen: `
  SELECT COUNT(*)::int AS total
  FROM jobs j
  LEFT JOIN job_statuses js ON js.id = j.status_id
  WHERE j.deleted_at IS NULL
    AND js.code = 'OPEN'
`,

  getAllOpen: `
  SELECT ${LIST_FIELDS}
  FROM jobs j
  JOIN job_categories jc ON jc.id = j.category_id
  JOIN employment_types et ON et.id = j.employment_type_id
  LEFT JOIN job_statuses js ON js.id = j.status_id
  JOIN job_locations jl ON jl.id = j.job_location_id
  JOIN education_levels el ON el.id = j.education_level_id
  JOIN departments d ON d.id = j.department_id
  JOIN work_modes wm ON wm.id = j.work_mode_id
  WHERE j.deleted_at IS NULL
    AND js.code = 'OPEN'
  ORDER BY j.created_at DESC
  LIMIT $1 OFFSET $2
`,

  getById: `
    SELECT ${DETAIL_FIELDS}
    FROM jobs j
    JOIN job_categories jc ON jc.id = j.category_id
    JOIN employment_types et ON et.id = j.employment_type_id
    JOIN job_statuses js ON js.id = j.status_id
    JOIN job_locations jl ON jl.id = j.job_location_id
    JOIN education_levels el ON el.id = j.education_level_id
    JOIN departments d ON d.id = j.department_id
    JOIN work_modes wm ON wm.id = j.work_mode_id
    JOIN management_profiles mp ON mp.id = j.management_profile_id
    LEFT JOIN management_profiles creator_mp ON creator_mp.user_id::text = j.created_by
    WHERE j.id = $1
      AND j.deleted_at IS NULL
    LIMIT 1
  `,

  getBySlug: `
    SELECT ${DETAIL_FIELDS}
    FROM jobs j
    JOIN job_categories jc ON jc.id = j.category_id
    JOIN employment_types et ON et.id = j.employment_type_id
    JOIN job_statuses js ON js.id = j.status_id
    JOIN job_locations jl ON jl.id = j.job_location_id
    JOIN education_levels el ON el.id = j.education_level_id
    JOIN departments d ON d.id = j.department_id
    JOIN work_modes wm ON wm.id = j.work_mode_id
    JOIN management_profiles mp ON mp.id = j.management_profile_id
    LEFT JOIN management_profiles creator_mp ON creator_mp.user_id::text = j.created_by
    WHERE j.slug = $1
      AND j.deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO jobs (
      management_profile_id,category_id,employment_type_id,status_id,job_location_id,education_level_id,department_id,
      work_mode_id,title,slug,description,requirements,responsibilities,benefits,
      min_salary,max_salary,currency_code,salary_type,vacancy_count,experience_min_years,
      published_at,close_at,is_active,created_at,created_by,updated_at,updated_by
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18, $19, $20,
      COALESCE($21, NOW()),
      $22,
      $23,
      NOW(),
      $24,
      NOW(),
      $24
    )
    RETURNING ${BASE_FIELDS}
  `,

  update: `
    UPDATE jobs
    SET
      management_profile_id = $1,
      category_id = $2,
      employment_type_id = $3,
      status_id = $4,
      job_location_id = $5,
      education_level_id = $6,
      department_id = $7,
      work_mode_id = $8,
      title = $9,
      slug = $10,
      description = $11,
      requirements = $12,
      responsibilities = $13,
      benefits = $14,
      min_salary = $15,
      max_salary = $16,
      currency_code = $17,
      salary_type = $18,
      vacancy_count = $19,
      experience_min_years = $20,
      published_at = COALESCE($21, published_at),
      close_at = $22,
      is_active = $23,
      updated_at = NOW(),
      updated_by = $24
    WHERE id = $25
      AND deleted_at IS NULL
    RETURNING ${BASE_FIELDS}
  `,

  softDelete: `
    UPDATE jobs
    SET
      is_active = FALSE,
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING ${BASE_FIELDS}
  `,
  
  updateStatus: `
  UPDATE jobs
  SET
    status_id = $1,
    updated_at = NOW(),
    updated_by = $2
  WHERE id = $3
    AND deleted_at IS NULL
  RETURNING ${BASE_FIELDS}
`,
};
