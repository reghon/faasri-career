const SELECT_FIELDS = `
  id, code, name, description,
  is_superadmin, is_active
`;

const DETAIL_FIELDS = `
  id, code, name, description, is_superadmin, is_active, created_at,
  created_by, updated_at, updated_by, deleted_at, deleted_by
`;

export const roleQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM roles
    WHERE deleted_at IS NULL
    ORDER BY name ASC
  `,

  getAllDeleted: `
    SELECT ${SELECT_FIELDS}
    FROM roles
    WHERE deleted_at IS NOT NULL
    ORDER BY name ASC
  `,

  getById: `
    SELECT ${DETAIL_FIELDS}
    FROM roles
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getSoftDeletedById: `
    SELECT ${DETAIL_FIELDS}
    FROM roles
    WHERE id = $1
      AND deleted_at IS NOT NULL
    LIMIT 1
  `,

  getByName: `
    SELECT id, code, name
    FROM roles
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByCode: `
    SELECT id, code, name
    FROM roles
    WHERE LOWER(code) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO roles (
      code, name, description, is_superadmin, is_active,
      created_at, created_by, updated_at, updated_by
    )
    VALUES (
      $1, $2, $3, $4, $5,
      NOW(), $6, NOW(), $6
    )
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE roles
    SET
      code = $1,
      name = $2,
      description = $3,
      is_superadmin = $4,
      is_active = $5,
      updated_at = NOW(),
      updated_by = $6
    WHERE id = $7
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  countRoleUsage: `
  SELECT COUNT(*)::int AS count
  FROM roles r
  JOIN users u ON r.id = u.role_id
  WHERE r.id = $1
`,

  softDelete: `
    UPDATE roles
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2,
      is_active = FALSE
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING ${DETAIL_FIELDS}
  `,

  restore: `
    UPDATE roles
    SET
      deleted_at = NULL,
      deleted_by = NULL,
      updated_at = NOW(),
      updated_by = $2,
      is_active = TRUE
    WHERE id = $1
      AND deleted_at IS NOT NULL
    RETURNING ${DETAIL_FIELDS}
  `,

  hardDelete: `
    DELETE FROM roles
    WHERE id = $1
      AND deleted_at IS NOT NULL
    RETURNING ${DETAIL_FIELDS}
  `,
};
