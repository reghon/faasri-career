const SELECT_FIELDS = `
  id, code, name, description, is_active
`;

const DETAIL_FIELDS = `
  id, code, name, description, is_active,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  code, name, description, is_active, created_at, created_by, updated_at, updated_by
`;

export const educationLevelQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM education_levels
    WHERE deleted_at IS NULL
    ORDER BY name ASC
  `,

  getAllDeleted: `
    SELECT ${SELECT_FIELDS}
    FROM education_levels
    WHERE deleted_at IS NOT NULL
    ORDER BY name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM education_levels
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getSoftDeletedById: `
    SELECT ${SELECT_FIELDS}
    FROM education_levels
    WHERE id = $1
      AND deleted_at IS NOT NULL
    LIMIT 1
  `,

  getDetailById: `
    SELECT ${DETAIL_FIELDS}
    FROM education_levels
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByName: `
    SELECT id, code, name
    FROM education_levels
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByCode: `
    SELECT id, code, name
    FROM education_levels
    WHERE LOWER(code) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO education_levels (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, NOW(), $5, NOW(), $5)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE education_levels
    SET
      code = $1,
      name = $2,
      description = $3,
      is_active = $4,
      updated_at = NOW(),
      updated_by = $5
    WHERE id = $6
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  softDelete: `
    UPDATE education_levels
    SET
      is_active = FALSE,
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
    RETURNING ${DETAIL_FIELDS}
  `,

  countOpenJobsUsage: `
  SELECT COUNT(*)::int AS count
  FROM jobs j
  JOIN job_statuses js ON js.id = j.status_id
  WHERE j.education_level_id = $1
    AND UPPER(js.code) = 'OPEN'
`,

  countJobsUsage: `
  SELECT COUNT(*)::int AS count
  FROM jobs j
  WHERE j.education_level_id = $1
`,

  hardDelete: `
    DELETE FROM education_levels
    WHERE id = $1
    RETURNING ${DETAIL_FIELDS}
  `,

  restore: `
    UPDATE education_levels
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
