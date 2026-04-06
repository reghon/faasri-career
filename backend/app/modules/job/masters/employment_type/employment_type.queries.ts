const SELECT_FIELDS = `
  id, name, description, is_active,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  name, description, is_active, created_at, created_by, updated_at, updated_by
`;

export const employmentTypeQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM employment_types
    WHERE deleted_at IS NULL
    ORDER BY name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM employment_types
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByName: `
    SELECT ${SELECT_FIELDS}
    FROM employment_types
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO employment_types (${INSERT_FIELDS})
    VALUES ($1, $2, $3, NOW(), $4, NOW(), $4)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE employment_types
    SET
      name = $1,
      description = $2,
      is_active = $3,
      updated_at = NOW(),
      updated_by = $4
    WHERE id = $5
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  softDelete: `
    UPDATE employment_types
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,
};
