const SELECT_FIELDS = `
  id, code, name, description, sort_order, is_default, is_final, is_active
`;

const DETAIL_FIELDS = `
  id, code, name, description, sort_order, is_default, is_final, is_active,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  code, name, description, sort_order, is_default, is_final, is_active,
  created_at, created_by, updated_at, updated_by
`;

export const applyStatusQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM apply_statuses
    WHERE deleted_at IS NULL
    ORDER BY sort_order ASC, name ASC
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
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, NOW(), $8)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE apply_statuses
    SET
      code = $1,
      name = $2,
      description = $3,
      sort_order = $4,
      is_default = $5,
      is_final = $6,
      is_active = $7,
      updated_at = NOW(),
      updated_by = $8
    WHERE id = $9
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
};
