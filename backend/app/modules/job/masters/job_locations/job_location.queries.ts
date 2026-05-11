const SELECT_FIELDS = `
  id, code, name, city, province, country, address, postal_code, is_active
`;

const DETAIL_FIELDS = `
  id, code, name, city, province, country, address, postal_code, is_active,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  code, name, city, province, country, address, postal_code,
  is_active, created_at, created_by, updated_at, updated_by
`;

export const jobLocationQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM job_locations
    WHERE deleted_at IS NULL
    ORDER BY name ASC
  `,

  getAllDeleted: `
    SELECT ${SELECT_FIELDS}
    FROM job_locations
    WHERE deleted_at IS NOT NULL
    ORDER BY name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM job_locations
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getSoftDeletedById: `
    SELECT ${SELECT_FIELDS}
    FROM job_locations
    WHERE id = $1
      AND deleted_at IS NOT NULL
    LIMIT 1
  `,

  getDetailById: `
    SELECT ${DETAIL_FIELDS}
    FROM job_locations
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByName: `
    SELECT id, name, code
    FROM job_locations
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByCode: `
    SELECT id, name, code
    FROM job_locations
    WHERE LOWER(code) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO job_locations (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, NOW(), $9)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE job_locations
    SET
      code = $1,
      name = $2,
      city = $3,
      province = $4,
      country = $5,
      address = $6,
      postal_code = $7,
      is_active = $8,
      updated_at = NOW(),
      updated_by = $9
    WHERE id = $10
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  countOpenJobsUsage: `
  SELECT COUNT(*)::int AS count
  FROM jobs j
  JOIN job_statuses js ON js.id = j.status_id
  WHERE j.job_location_id = $1
    AND UPPER(js.code) = 'OPEN'
`,

  countJobsUsage: `
  SELECT COUNT(*)::int AS count
  FROM jobs j
  WHERE j.job_location_id = $1
`,

  softDelete: `
    UPDATE job_locations
    SET
      is_active = FALSE,
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
    RETURNING ${DETAIL_FIELDS}
  `,

  hardDelete: `
    DELETE FROM job_locations
    WHERE id = $1
    RETURNING ${DETAIL_FIELDS}
  `,

  restore: `
    UPDATE job_locations
    SET
      is_active = TRUE, 
      deleted_at = NULL,
      deleted_by = NULL,
      updated_at = NOW(),
      updated_by = $2 
    WHERE id = $1
    RETURNING ${DETAIL_FIELDS}
  `,
};
