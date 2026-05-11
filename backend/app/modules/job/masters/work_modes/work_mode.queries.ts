const SELECT_FIELDS = `
  id, code, name, is_active
`;

const DETAIL_FIELDS = `
  id, code, name, is_active,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  code, name, is_active, created_at, created_by, updated_at, updated_by
`;

export const workModeQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM work_modes
    WHERE deleted_at IS NULL
    ORDER BY name ASC
  `,

  getAllDeleted: `
    SELECT ${SELECT_FIELDS}
    FROM work_modes
    WHERE deleted_at IS NOT NULL
    ORDER BY name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM work_modes
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getSoftDeletedById: `
    SELECT ${SELECT_FIELDS}
    FROM work_modes
    WHERE id = $1
      AND deleted_at IS NOT NULL
    LIMIT 1
  `,

  getDetailById: `
    SELECT ${DETAIL_FIELDS}
    FROM work_modes
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByName: `
    SELECT id, code, name
    FROM work_modes
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByCode: `
    SELECT id, code, name
    FROM work_modes
    WHERE LOWER(code) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO work_modes (${INSERT_FIELDS})
    VALUES ($1, $2, $3, NOW(), $4, NOW(), $4)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE work_modes
    SET
      code = $1,
      name = $2,
      is_active = $3,
      updated_at = NOW(),
      updated_by = $4
    WHERE id = $5
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  countOpenJobsUsage: `
  SELECT COUNT(*)::int AS count
  FROM jobs j
  JOIN job_statuses js ON js.id = j.status_id
  WHERE j.work_mode_id = $1
    AND UPPER(js.code) = 'OPEN'
`,

  countJobsUsage: `
  SELECT COUNT(*)::int AS count
  FROM jobs j
  WHERE j.work_mode_id = $1
`,

  softDelete: `
    UPDATE work_modes
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
    DELETE FROM work_modes
    WHERE id = $1
    RETURNING ${DETAIL_FIELDS}
  `,

  restore: `
    UPDATE work_modes
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
