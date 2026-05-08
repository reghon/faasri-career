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

export const departmentQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM departments
    WHERE deleted_at IS NULL
    ORDER BY name ASC
  `,

  getAllDeleted: `
    SELECT ${SELECT_FIELDS}
    FROM departments
    WHERE deleted_at IS NOT NULL
    ORDER BY name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM departments
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getSoftDeletedById: `
    SELECT ${SELECT_FIELDS}
    FROM departments
    WHERE id = $1
      AND deleted_at IS NOT NULL
    LIMIT 1
  `,

  getDetailById: `
    SELECT ${DETAIL_FIELDS}
    FROM departments
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByName: `
    SELECT id, code, name
    FROM departments
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByCode: `
    SELECT id, code, name
    FROM departments
    WHERE LOWER(code) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO departments (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, NOW(), $5, NOW(), $5)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE departments
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
    UPDATE departments
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
    DELETE FROM departments
    WHERE id = $1
    RETURNING ${DETAIL_FIELDS}
  `,

  restore: `
    UPDATE departments
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
