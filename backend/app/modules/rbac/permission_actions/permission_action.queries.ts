const SELECT_FIELDS = `
  id, code, name, description, is_active,
  created_at, created_by, updated_at, updated_by,
  deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  code, name, description, is_active,
  created_at, created_by, updated_at, updated_by
`;

export const permissionActionQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM permission_actions
    WHERE deleted_at IS NULL
    ORDER BY updated_at DESC, name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM permission_actions
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByCode: `
    SELECT ${SELECT_FIELDS}
    FROM permission_actions
    WHERE LOWER(code) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByName: `
    SELECT ${SELECT_FIELDS}
    FROM permission_actions
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO permission_actions (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, NOW(), $5, NOW(), $5)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE permission_actions
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
    UPDATE permission_actions
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING id
  `,
};
