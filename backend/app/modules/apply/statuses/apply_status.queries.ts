const SELECT_FIELDS = `
  id, code, name, description, is_active
`;

const DETAIL_FIELDS = `
  id, code, name, description, is_active,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  code, name, description, is_active,
  created_at, created_by, updated_at, updated_by
`;

export const applyStatusQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM apply_statuses
    WHERE deleted_at IS NULL
    ORDER BY name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM apply_statuses
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getDetailById: `
    SELECT ${DETAIL_FIELDS}
    FROM apply_statuses
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByName: `
    SELECT id, name, code
    FROM apply_statuses
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByCode: `
    SELECT id, name, code
    FROM apply_statuses
    WHERE LOWER(code) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO apply_statuses (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, NOW(), $5, NOW(), $5)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE apply_statuses
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
    UPDATE apply_statuses
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING ${DETAIL_FIELDS}
  `,

  getDefaultByJobId: `
  SELECT
    jas.apply_status_id AS id,
    aps.code,
    aps.name
  FROM job_apply_statuses jas
  JOIN apply_statuses aps
    ON aps.id = jas.apply_status_id
   AND aps.deleted_at IS NULL
  WHERE jas.job_id = $1
    AND jas.is_default = true
    AND jas.is_active = true
    AND jas.deleted_at IS NULL
  LIMIT 1
`,
};
